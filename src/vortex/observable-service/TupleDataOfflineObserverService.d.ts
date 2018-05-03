import { Subject } from "rxjs/Subject";
import { VortexService } from "../VortexService";
import { Tuple } from "../Tuple";
import { TupleSelector } from "../TupleSelector";
import { ComponentLifecycleEventEmitter } from "../ComponentLifecycleEventEmitter";
import { VortexStatusService } from "../VortexStatusService";
import * as moment from "moment";
import { TupleOfflineStorageService } from "../storage/TupleOfflineStorageService";
export declare class TupleDataObservableNameService {
    name: string;
    additionalFilt: {};
    constructor(name: string, additionalFilt?: {});
    equals(other: TupleDataObservableNameService): boolean;
    toString(): string;
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
    storageEnabled: boolean;
    constructor(tupleSelector: TupleSelector);
    markForTearDown(): void;
    resetTearDown(): void;
    isReadyForTearDown(): boolean;
}
export declare class TupleDataOfflineObserverService extends ComponentLifecycleEventEmitter {
    private vortexService;
    private vortexStatusService;
    private tupleDataObservableName;
    private tupleOfflineStorageService;
    private endpoint;
    private filt;
    private cacheByTupleSelector;
    constructor(vortexService: VortexService, vortexStatusService: VortexStatusService, tupleDataObservableName: TupleDataObservableNameService, tupleOfflineStorageService: TupleOfflineStorageService);
    _nameService(): TupleDataObservableNameService;
    pollForTuples(tupleSelector: TupleSelector): Promise<Tuple[]>;
    subscribeToTupleSelector(tupleSelector: TupleSelector, enableCache?: boolean, enableStorage?: boolean): Subject<Tuple[]>;
    /** Update Offline State
     *
     * This method updates the offline stored data, which will be used until the next
     * update from the server comes along.
     * @param tupleSelector: The tuple selector to update tuples for
     * @param tuples: The new data to store
     */
    updateOfflineState(tupleSelector: TupleSelector, tuples: Tuple[]): void;
    private cleanupDeadCaches();
    private vortexOnlineChanged();
    private receivePayload(payload, encodedPayload);
    private tellServerWeWantData(tupleSelectors, enableCache?, unsubscribe?);
    private notifyObservers(cachedData, tupleSelector, tuples, encodedPayload?);
    private storeDataLocally(tupleSelector, tuples, encodedPayload?);
}
