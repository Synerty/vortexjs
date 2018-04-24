import { NgZone } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { VortexService } from "../VortexService";
import { Tuple } from "../Tuple";
import { TupleSelector } from "../TupleSelector";
import { IPayloadFilt, Payload } from "../Payload";
import { PayloadEndpoint } from "../PayloadEndpoint";
import { ComponentLifecycleEventEmitter } from "../ComponentLifecycleEventEmitter";
import { VortexStatusService } from "../VortexStatusService";
import * as moment from "moment";
export declare class TupleDataObservableNameService {
    name: string;
    additionalFilt: {};
    constructor(name: string, additionalFilt?: {});
}
export declare class CachedSubscribedData {
    tupleSelector: TupleSelector;
    subject: Subject<Tuple[]>;
    private tearDownDate;
    private TEARDOWN_WAIT;
    tuples: Tuple[];
    /** Last Server Payload Date
     * If the server has responded with a payload, this is the date in the payload
     * @type {Date | null}
     */
    lastServerPayloadDate: moment.Moment | null;
    cacheEnabled: boolean;
    constructor(tupleSelector: TupleSelector);
    markForTearDown(): void;
    resetTearDown(): void;
    isReadyForTearDown(): boolean;
}
export declare class TupleDataObserverService extends ComponentLifecycleEventEmitter {
    protected vortexService: VortexService;
    protected statusService: VortexStatusService;
    protected zone: NgZone;
    protected endpoint: PayloadEndpoint;
    protected filt: IPayloadFilt;
    protected cacheByTupleSelector: {
        [tupleSelector: string]: CachedSubscribedData;
    };
    constructor(vortexService: VortexService, statusService: VortexStatusService, zone: NgZone, tupleDataObservableName: TupleDataObservableNameService);
    pollForTuples(tupleSelector: TupleSelector): Promise<Tuple[]>;
    subscribeToTupleSelector(tupleSelector: TupleSelector, enableCache?: boolean): Subject<Tuple[]>;
    private cleanupDeadCaches();
    protected vortexOnlineChanged(): void;
    protected receivePayload(payload: Payload): void;
    protected notifyObservers(cachedData: CachedSubscribedData, tupleSelector: TupleSelector, tuples: Tuple[]): void;
    protected tellServerWeWantData(tupleSelectors: TupleSelector[], enableCache?: boolean, unsubscribe?: boolean): void;
}
