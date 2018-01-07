import { NgZone } from "@angular/core";
import { Subject } from "rxjs";
import { VortexService } from "./VortexService";
import { Tuple } from "./Tuple";
import { TupleSelector } from "./TupleSelector";
import { VortexStatusService } from "./VortexStatusService";
import { TupleOfflineStorageService } from "./TupleOfflineStorageService";
import { TupleDataObservableNameService, TupleDataObserverService, CachedSubscribedData } from "./TupleDataObserverService";
export declare class TupleDataOfflineObserverService extends TupleDataObserverService {
    private tupleOfflineStorageService;
    constructor(vortexService: VortexService, vortexStatusService: VortexStatusService, zone: NgZone, tupleDataObservableName: TupleDataObservableNameService, tupleOfflineStorageService: TupleOfflineStorageService);
    subscribeToTupleSelector(tupleSelector: TupleSelector): Subject<Tuple[]>;
    /** Update Offline State
     *
     * This method updates the offline stored data, which will be used until the next
     * update from the server comes along.
     * @param tupleSelector: The tuple selector to update tuples for
     * @param tuples: The new data to store
     */
    updateOfflineState(tupleSelector: TupleSelector, tuples: Tuple[]): void;
    protected notifyObservers(cachedData: CachedSubscribedData, tupleSelector: TupleSelector, tuples: Tuple[]): void;
    private storeDataLocally(tupleSelector, tuples);
}
