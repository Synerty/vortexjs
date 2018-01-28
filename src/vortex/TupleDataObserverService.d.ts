import { NgZone } from "@angular/core";
import { Subject } from "rxjs";
import { VortexService } from "./VortexService";
import { Tuple } from "./Tuple";
import { TupleSelector } from "./TupleSelector";
import { IPayloadFilt } from "./Payload";
import { PayloadEndpoint } from "./PayloadEndpoint";
import { ComponentLifecycleEventEmitter } from "./ComponentLifecycleEventEmitter";
import { VortexStatusService } from "./VortexStatusService";
export declare class TupleDataObservableNameService {
    name: string;
    additionalFilt: {};
    constructor(name: string, additionalFilt?: {});
}
export declare class CachedSubscribedData {
    subject: Subject<Tuple[]>;
    private tearDownDate;
    private TEARDOWN_WAIT;
    tuples: Tuple[];
    serverResponded: boolean;
    cacheEnabled: boolean;
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
    protected receivePayload(payload: any): void;
    protected notifyObservers(cachedData: CachedSubscribedData, tupleSelector: TupleSelector, tuples: Tuple[]): void;
    protected tellServerWeWantData(tupleSelectors: TupleSelector[]): void;
}
