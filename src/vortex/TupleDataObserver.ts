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

export class TupleDataObservableName {
    constructor(public name: string) {

    }
}

@Injectable()
export class TupleDataObserver extends ComponentLifecycleEventEmitter {
    private obervableName: string;
    private endpoint: PayloadEndpoint;
    private filt: IPayloadFilt;
    private subjectsByTupleSelector: { [tupleSelector: string]: Subject<Tuple[]> } = {};

    constructor(private vortexService: VortexService,
                vortexStatusService: VortexStatusService,
                private zone: NgZone,
                tupleDataObservableName: TupleDataObservableName) {
        super();

        this.obervableName = tupleDataObservableName.name;

        this.filt = {
            "name": this.obervableName,
            "key": "tupleDataObservable"
        };

        this.endpoint = new PayloadEndpoint(this, this.filt);
        this.endpoint.observable.subscribe((payload) => this.receivePayload(payload));

        let isOnlineSub = vortexStatusService.isOnline
            .filter(online => online === true)
            .subscribe(online => this.vortexOnlineChanged());

        this.onDestroyEvent.subscribe(() => isOnlineSub.unsubscribe());
    }

    subscribeToTupleSelector(tupleSelector: TupleSelector): Subject<Tuple[]> {
        this.tellServerWeWantData([tupleSelector]);

        let tsStr = tupleSelector.toOrderedJsonStr();
        if (this.subjectsByTupleSelector.hasOwnProperty(tsStr))
            return this.subjectsByTupleSelector.hasOwnProperty[tsStr];

        let newSubject = new Subject<Tuple[]>();
        this.subjectsByTupleSelector[tsStr] = newSubject;

        return newSubject;
    }

    private vortexOnlineChanged() {
        let tupleSelectors: TupleSelector[] = [];
        for (let key of dictKeysFromObject(this.subjectsByTupleSelector)) {
            tupleSelectors.push(TupleSelector.fromJsonStr(key));
        }
        this.tellServerWeWantData(tupleSelectors);
    }

    private receivePayload(payload) {
        let tupleSelector = payload.filt.tupleSelector;
        let tsStr = tupleSelector.toOrderedJsonStr();

        if (!this.subjectsByTupleSelector.hasOwnProperty(tsStr))
            return;

        let subject = this.subjectsByTupleSelector[tsStr];
        this.zone.run(() => subject.next(payload.tuples));
    }

    private tellServerWeWantData(tupleSelectors: TupleSelector[]) {
        let payloads: Payload[] = [];
        for (let tupleSelector of tupleSelectors) {
            let filt = extend({}, {
                "tupleSelector": tupleSelector
            }, this.filt);

            payloads.push(new Payload(filt));
        }
        this.vortexService.sendPayload(payloads);
    }
}

