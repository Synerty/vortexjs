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

@Injectable()
export class TupleDataObserverService extends ComponentLifecycleEventEmitter {
    protected endpoint: PayloadEndpoint;
    protected filt: IPayloadFilt;
    protected subjectsByTupleSelector: { [tupleSelector: string]: Subject<Tuple[]> } = {};

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

        let isOnlineSub = statusService.isOnline
            .filter(online => online === true)
            .subscribe(online => this.vortexOnlineChanged());

        this.onDestroyEvent.subscribe(() => isOnlineSub.unsubscribe());
    }

    pollForTuples(tupleSelector: TupleSelector): Promise<Tuple[]> {

        let startFilt = extend({"subscribe": false}, this.filt, {
            "tupleSelector": tupleSelector
        });

        return new PayloadResponse(this.vortexService, new Payload(startFilt))
            .then(payload => payload.tuples);
    }

    subscribeToTupleSelector(tupleSelector: TupleSelector): Subject<Tuple[]> {

        let tsStr = tupleSelector.toOrderedJsonStr();
        if (this.subjectsByTupleSelector.hasOwnProperty(tsStr))
            return this.subjectsByTupleSelector[tsStr];

        let newSubject = new Subject<Tuple[]>();
        this.subjectsByTupleSelector[tsStr] = newSubject;

        this.tellServerWeWantData([tupleSelector]);

        return newSubject;
    }

    protected vortexOnlineChanged(): void {
        let tupleSelectors: TupleSelector[] = [];
        for (let key of dictKeysFromObject(this.subjectsByTupleSelector)) {
            tupleSelectors.push(TupleSelector.fromJsonStr(key));
        }
        this.tellServerWeWantData(tupleSelectors);
    }

    protected receivePayload(payload): void {
        let tupleSelector = payload.filt.tupleSelector;
        let tsStr = tupleSelector.toOrderedJsonStr();

        if (!this.subjectsByTupleSelector.hasOwnProperty(tsStr))
            return;

        let subject = this.subjectsByTupleSelector[tsStr];
        this.notifyObservers(subject, tupleSelector, payload.tuples);
    }

    protected notifyObservers(subject: Subject<Tuple[]>,
                              tupleSelector: TupleSelector,
                              tuples: Tuple[]): void {
        this.zone.run(() => subject.next(tuples));
    }

    protected tellServerWeWantData(tupleSelectors: TupleSelector[]): void {
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

