import {Injectable, NgZone} from "@angular/core";
import {Subject} from "rxjs/Subject";
import {VortexService} from "../VortexService";
import {Tuple} from "../Tuple";
import {TupleSelector} from "../TupleSelector";
import {IPayloadFilt, Payload} from "../Payload";
import {PayloadEndpoint} from "../PayloadEndpoint";
import {ComponentLifecycleEventEmitter} from "../ComponentLifecycleEventEmitter";
import {dictKeysFromObject, extend} from "../UtilMisc";
import {VortexStatusService} from "../VortexStatusService";
import {PayloadResponse} from "../PayloadResponse";
import * as moment from "moment";
import {PayloadEnvelope} from "../PayloadEnvelope";

@Injectable()
export class TupleDataObservableNameService {
    constructor(public name: string, public additionalFilt = {}) {

    }
}

export class CachedSubscribedData {
    subject: Subject<Tuple[]> = new Subject<Tuple[]>();

    // The date the cache is scheduled to be torn down.
    // This will be X time after we notice that it has no subscribers
    private tearDownDate: number | null = null;
    private TEARDOWN_WAIT = 120 * 1000; // 2 minutes, in milliseconds

    tuples: Tuple[] = [];

    /** Last Server Payload Date
     * If the server has responded with a payload, this is the date in the payload
     * @type {Date | null}
     */
    lastServerPayloadDate: moment.Moment | null = null;

    cacheEnabled = true;

    constructor(public tupleSelector: TupleSelector) {

    }

    markForTearDown(): void {
        if (this.tearDownDate == null)
            this.tearDownDate = Date.now() + this.TEARDOWN_WAIT;
    }

    resetTearDown(): void {
        this.tearDownDate = null;
    }

    isReadyForTearDown(): boolean {
        return this.tearDownDate != null && this.tearDownDate <= Date.now();
    }
}

@Injectable()
export class TupleDataObserverService extends ComponentLifecycleEventEmitter {
    protected endpoint: PayloadEndpoint;
    protected filt: IPayloadFilt;
    protected cacheByTupleSelector: { [tupleSelector: string]: CachedSubscribedData } = {};

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
        this.endpoint.observable
            .subscribe((payloadEnvelope: PayloadEnvelope) => {
                payloadEnvelope
                    .decodePayload()
                    .then((payload: Payload) => {
                        this.receivePayload(payload, payloadEnvelope.encodedPayload)
                    })
                    .catch(e => {
                        console.log(`TupleActionProcessorService:Error decoding payload ${e}`)
                    });
            });

        statusService.isOnline
            .takeUntil(this.onDestroyEvent)
            .filter(online => online === true)
            .subscribe(online => this.vortexOnlineChanged());

        // Cleanup dead subscribers every 30 seconds.
        let cleanupTimer = setInterval(() => this.cleanupDeadCaches(), 30000);
        this.onDestroyEvent.subscribe(() => clearInterval(cleanupTimer));
    }

    pollForTuples(tupleSelector: TupleSelector): Promise<Tuple[]> {

        let startFilt = extend({"subscribe": false}, this.filt, {
            "tupleSelector": tupleSelector
        });

        // Optionally typed, No need to worry about the fact that we convert this
        // and then TypeScript doesn't recognise that data type change
        let promise: any = new Payload(startFilt).makePayloadEnvelope();

        promise = promise.then((payloadEnvelope: PayloadEnvelope) => {
            return new PayloadResponse(this.vortexService, payloadEnvelope)
        });

        promise = promise.then((payloadEnvelope: PayloadEnvelope) => {
            return payloadEnvelope.decodePayload();
        });

        promise = promise.then((payload: Payload) => payload.tuples);

        return promise;
    }

    subscribeToTupleSelector(tupleSelector: TupleSelector,
                             enableCache: boolean = true): Subject<Tuple[]> {

        let tsStr = tupleSelector.toOrderedJsonStr();
        if (this.cacheByTupleSelector.hasOwnProperty(tsStr)) {
            let cachedData = this.cacheByTupleSelector[tsStr];
            cachedData.resetTearDown();
            cachedData.cacheEnabled = cachedData.cacheEnabled && enableCache;

            if (cachedData.cacheEnabled) {
                // Emit after we return
                setTimeout(() => {
                    this.notifyObservers(cachedData, tupleSelector, cachedData.tuples);
                }, 0);
            } else {
                cachedData.tuples = [];
                this.tellServerWeWantData([tupleSelector], enableCache);
            }

            return cachedData.subject;
        }

        let newCachedData = new CachedSubscribedData(tupleSelector);
        newCachedData.cacheEnabled = enableCache;
        this.cacheByTupleSelector[tsStr] = newCachedData;

        this.tellServerWeWantData([tupleSelector], enableCache);

        return newCachedData.subject;

    }

    private cleanupDeadCaches(): void {
        for (let key of dictKeysFromObject(this.cacheByTupleSelector)) {
            let cachedData = this.cacheByTupleSelector[key];
            if (cachedData.subject.observers.length != 0) {
                cachedData.resetTearDown();
            } else {
                if (cachedData.isReadyForTearDown()) {
                    delete this.cacheByTupleSelector[key];
                    this.tellServerWeWantData(
                        [cachedData.tupleSelector],
                        cachedData.cacheEnabled,
                        true
                    );
                } else {
                    cachedData.markForTearDown();
                }
            }
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

    protected receivePayload(payload: Payload, encodedPayload: string): void {
        let tupleSelector = payload.filt["tupleSelector"];
        let tsStr = tupleSelector.toOrderedJsonStr();

        if (!this.cacheByTupleSelector.hasOwnProperty(tsStr))
            return;

        let cachedData = this.cacheByTupleSelector[tsStr];

        let lastDate = cachedData.lastServerPayloadDate;

        if (payload.date == null) {
            throw new Error("payload.date can not be null");
        }
        let thisDate = moment(payload.date);

        // If the data is old, then disregard it.
        if (lastDate != null && lastDate.isAfter(thisDate))
            return;

        cachedData.lastServerPayloadDate = thisDate;
        cachedData.tuples = payload.tuples;

        this.notifyObservers(cachedData, tupleSelector, payload.tuples, encodedPayload);
    }

    protected notifyObservers(cachedData: CachedSubscribedData,
                              tupleSelector: TupleSelector,
                              tuples: Tuple[],
                              encodedPayload: string | null = null): void {

        try {
            cachedData.subject.next(tuples);

        } catch (e) {
            // NOTE: Observables automatically remove observers when the raise exceptions.
            console.log(`ERROR: TupleDataObserverService.notifyObservers, observable has been removed
            ${e.toString()}
            ${tupleSelector.toOrderedJsonStr()}`);
        }

    }

    protected tellServerWeWantData(tupleSelectors: TupleSelector[],
                                   enableCache: boolean = true,
                                   unsubscribe: boolean = false): void {
        if (!this.statusService.snapshot.isOnline)
            return;

        let startFilt = extend({"subscribe": true}, this.filt);

        let payloads: Payload[] = [];
        for (let tupleSelector of tupleSelectors) {
            let filt = extend({}, startFilt, {
                "tupleSelector": tupleSelector,
                "enableCache": enableCache,
                "unsubscribe": unsubscribe
            });

            payloads.push(new Payload(filt));
        }
        this.vortexService.sendPayload(payloads);
    }

}

