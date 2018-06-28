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
    askServerEnabled: boolean;
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
    /** Flush Cache
     *
     * The Data Offine Observer can be used to offline cache data by observing a large
     * amounts of data, more data then the user would normally look at.
     *
     * If it's being used like this then the cache should be flushed during the process
     * to ensure it's not all being kept in memory.
     *
     * @param {TupleSelector} tupleSelector The tuple selector to flush the cache for
     */
    flushCache(tupleSelector: TupleSelector): void;
    /** Subscribe to Tuple Selector
     *
     * Get an observable that will be fired when any new data updates are available
     * * either from the server, or if they are locally updated with updateOfflineState()
     *
     * @param {TupleSelector} tupleSelector
     * @param {boolean} disableCache
     * @param {boolean} disableStorage
     * @param {boolean} disableAskServer, Use this to store and observe data completely
     *      within the angular app.
     * @returns {Subject<Tuple[]>}
     */
    subscribeToTupleSelector(tupleSelector: TupleSelector, disableCache?: boolean, disableStorage?: boolean, disableAskServer?: boolean): Subject<Tuple[]>;
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
    private tellServerWeWantData(tupleSelectors, disableCache?, unsubscribe?);
    private notifyObservers(cachedData, tupleSelector, tuples, encodedPayload?);
    private storeDataLocally(tupleSelector, tuples, encodedPayload?);
}
