import {Injectable, NgZone} from "@angular/core";
import {Subject} from "rxjs";
import {VortexService} from "./VortexService";
import {Tuple} from "./Tuple";
import {TupleSelector} from "./TupleSelector";
import {Payload, IPayloadFilt} from "./Payload";
import {PayloadEndpoint} from "./PayloadEndpoint";
import {ComponentLifecycleEventEmitter} from "./ComponentLifecycleEventEmitter";
import {extend, dictKeysFromObject} from "./UtilMisc";
import {VortexStatusService} from "./VortexStatusService";
import {PayloadResponse} from "./PayloadResponse";

@Injectable()
export class TupleDataObservableNameService {
    constructor(public name: string, public additionalFilt = {}) {

    }
}

export class CachedSubscribedData {
  subject:Subject<Tuple[]> = new Subject<Tuple[]>();
  tuples:Tuple[] = [];
}

@Injectable()
export class TupleDataObserverService extends ComponentLifecycleEventEmitter {
    protected endpoint: PayloadEndpoint;
    protected filt: IPayloadFilt;
    protected cacheByTupleSelector: { [tupleSelector: string]: CachedSubscribedData} = {};

    constructor(protected vortexService: VortexService,
                protected statusService: VortexStatusService,
                protected zone: NgZone,
                tupleDataObservableName: TupleDataObservableNameService) {
        super();

        this.filt = extend({
            "name": tupleDataObservableName.name,
            "key": "tupleDataObservable"
        }, tupleDataObservableName.additionalFilt);

        this.endpoint = new PayloadEndpoint(this, this.filt);
        this.endpoint.observable.subscribe((payload) => this.receivePayload(payload));

        statusService.isOnline
            .takeUntil(this.onDestroyEvent)
            .filter(online => online === true)
            .subscribe(online => this.vortexOnlineChanged());

        // Cleanup dead subscribers every 30 seconds.
        let cleanupTimer = setInterval(() => this.cleanupDeadCaches(), 30);
        this.onDestroyEvent.subscribe(() => clearInterval(cleanupTimer));
    }

    pollForTuples(tupleSelector: TupleSelector): Promise<Tuple[]> {

        let startFilt = extend({"subscribe": false}, this.filt, {
            "tupleSelector": tupleSelector
        });

        // Optionally typed, No need to worry about the fact that we convert this
        // and then TypeScript doesn't recignise that data type change
        let promise: any = new PayloadResponse(this.vortexService, new Payload(startFilt))
            .then(payload => payload.tuples);
        return promise;
    }


    subscribeToTupleSelector(tupleSelector: TupleSelector): Subject<Tuple[]> {

        let tsStr = tupleSelector.toOrderedJsonStr();
        if (this.cacheByTupleSelector.hasOwnProperty(tsStr)) {
            let cachedData = this.cacheByTupleSelector[tsStr];
            // Emit the data 5 seconds later.
            setTimeout(() => cachedData.subject.next(cachedData.tuples), 5);
            return cachedData.subject;
        }

        let newCahcedData = new CachedSubscribedData();
        this.cacheByTupleSelector[tsStr] = newCahcedData;

        this.tellServerWeWantData([tupleSelector]);

        return newCahcedData.subject;

    }

    private cleanupDeadCaches() :void {
        for (let key of dictKeysFromObject(this.cacheByTupleSelector)) {
            let cachedData = this.cacheByTupleSelector[key];
            if (cachedData.subject.observers.length == 0)
                delete this.cacheByTupleSelector[key];
        }
    }

    protected vortexOnlineChanged(): void {
        this.cleanupDeadCaches();
        let tupleSelectors: TupleSelector[] = [];
        for (let key of dictKeysFromObject(this.cacheByTupleSelector)) {
            tupleSelectors.push(TupleSelector.fromJsonStr(key));
        }
        this.tellServerWeWantData(tupleSelectors);
    }

    protected receivePayload(payload): void {
        let tupleSelector = payload.filt.tupleSelector;
        let tsStr = tupleSelector.toOrderedJsonStr();

        if (!this.cacheByTupleSelector.hasOwnProperty(tsStr))
            return;

        let cachedData = this.cacheByTupleSelector[tsStr];
        this.notifyObservers(cachedData, tupleSelector, payload.tuples);
    }

    protected notifyObservers(cachedData: CachedSubscribedData,
                              tupleSelector: TupleSelector,
                              tuples: Tuple[]): void {

        try {
            cachedData.tuples = tuples;
            cachedData.subject.next(tuples);

        } catch (e) {
            // NOTE: Observables automatically remove observers when the raise exceptions.
            console.log(`ERROR: TupleDataObserverService.notifyObservers, observable has been removed
            ${e.toString()}
            ${tupleSelector.toOrderedJsonStr()}`);
        }

    }

    protected tellServerWeWantData(tupleSelectors: TupleSelector[]): void {
        if (!this.statusService.snapshot.isOnline)
            return;

        let startFilt = extend({"subscribe": true}, this.filt);

        let payloads: Payload[] = [];
        for (let tupleSelector of tupleSelectors) {
            let filt = extend({}, startFilt, {
                "tupleSelector": tupleSelector
            });

            payloads.push(new Payload(filt));
        }
        this.vortexService.sendPayload(payloads);
    }
}

