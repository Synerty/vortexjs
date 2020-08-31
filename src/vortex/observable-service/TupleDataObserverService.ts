import {Inject, Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {Tuple} from "../exports";
import {TupleSelector} from "../TupleSelector";
import {
    TupleDataObservableNameService,
    TupleDataOfflineObserverService
} from "./TupleDataOfflineObserverService";

export {TupleDataObservableNameService} from "./TupleDataOfflineObserverService";

@Injectable()
export class TupleDataObserverService {
    constructor(
        @Inject(TupleDataOfflineObserverService) private delegate,
        @Inject(TupleDataObservableNameService) private tupleDataObservableName,
    ) {
        let delegateName = delegate._nameService();
        if (!this.tupleDataObservableName.equals(delegateName)) {
            throw new Error("ERROR: The TupleDataObserverService was injected"
                + " with the wrong TupleDataOfflineObserverService name service"
                + ` ${delegateName} VS ${this.tupleDataObservableName}`
                + " ensure TupleDataOfflineObserverService is provided first."
            );
        }
    }

    pollForTuples(tupleSelector: TupleSelector, useCache: boolean = true): Promise<Tuple[]> {
        return this.delegate.pollForTuples(tupleSelector, useCache);
    }

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
    subscribeToTupleSelector(tupleSelector: TupleSelector,
                             disableCache: boolean = false,
                             disableAskServer: boolean = false): Observable<Tuple[]> {
        return this.delegate.subscribeToTupleSelector(
            tupleSelector, disableCache, true, disableAskServer)
    }
}

