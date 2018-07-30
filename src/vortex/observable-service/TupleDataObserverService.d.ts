import { Observable } from "rxjs";
import { Tuple } from "../Tuple";
import { TupleSelector } from "../TupleSelector";
import { TupleDataObservableNameService, TupleDataOfflineObserverService } from "./TupleDataOfflineObserverService";
export { TupleDataObservableNameService } from "./TupleDataOfflineObserverService";
export declare class TupleDataObserverService {
    private delegate;
    private tupleDataObservableName;
    constructor(delegate: TupleDataOfflineObserverService, tupleDataObservableName: TupleDataObservableNameService);
    pollForTuples(tupleSelector: TupleSelector, useCache?: boolean): Promise<Tuple[]>;
    /** Subscribe to Tuple Selector
     *
     * Get an observable that will be fired when any new data updates are available
     * * either from the server, or if they are locally updated with updateOfflineState()
     *
     * @param {TupleSelector} tupleSelector
     * @param {boolean} disableCache
     * @param {boolean} disableAskServer, Use this to store and observe data completely
     *      within the angular app.
     * @returns {Subject<Tuple[]>}
     */
    subscribeToTupleSelector(tupleSelector: TupleSelector, disableCache?: boolean, disableAskServer?: boolean): Observable<Tuple[]>;
}
