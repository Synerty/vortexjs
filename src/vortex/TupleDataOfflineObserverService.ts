import {Injectable, NgZone} from "@angular/core";
import {Subject} from "rxjs";
import {VortexService} from "./VortexService";
import {Tuple} from "./Tuple";
import {TupleSelector} from "./TupleSelector";
import {VortexStatusService} from "./VortexStatusService";
import {TupleOfflineStorageService} from "./TupleOfflineStorageService";
import {
    TupleDataObservableNameService,
    TupleDataObserverService,
    CachedSubscribedData
} from "./TupleDataObserverService";


@Injectable()
export class TupleDataOfflineObserverService extends TupleDataObserverService {

    constructor(vortexService: VortexService,
                vortexStatusService: VortexStatusService,
                zone: NgZone,
                tupleDataObservableName: TupleDataObservableNameService,
                private tupleOfflineStorageService: TupleOfflineStorageService) {
        super(vortexService, vortexStatusService, zone, tupleDataObservableName);

    }

    subscribeToTupleSelector(tupleSelector: TupleSelector,
                             enableCache:boolean=true): Subject<Tuple[]> {

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

        let newCachedData = new CachedSubscribedData();
        newCachedData.cacheEnabled = enableCache;
        this.cacheByTupleSelector[tsStr] = newCachedData;

        this.tellServerWeWantData([tupleSelector], enableCache);

        this.tupleOfflineStorageService
          .loadTuples(tupleSelector)
            .then((tuples: Tuple[]) => {
               // If the server has responded before we loaded the data, then just
               // ignore the cached data.
               if (newCachedData.serverResponded)
                 return;

               // Update the tuples, and notify if them
               newCachedData.tuples = tuples;
               super.notifyObservers(newCachedData, tupleSelector, tuples);
            })
            .catch(err => {
                this.statusService.logError(`loadTuples failed : ${err}`);
                throw new Error(err);
            });

        return newCachedData.subject;
    }

    /** Update Offline State
     *
     * This method updates the offline stored data, which will be used until the next
     * update from the server comes along.
     * @param tupleSelector: The tuple selector to update tuples for
     * @param tuples: The new data to store
     */
    updateOfflineState(tupleSelector: TupleSelector, tuples: Tuple[]): void {
        // AND store the data locally
        this.storeDataLocally(tupleSelector, tuples);

        let tsStr = tupleSelector.toOrderedJsonStr();

        if (this.cacheByTupleSelector.hasOwnProperty(tsStr)) {
            let cachedData = this.cacheByTupleSelector[tsStr];
            cachedData.tuples = tuples;
            super.notifyObservers(cachedData, tupleSelector, tuples);
        }

    }

    protected notifyObservers(cachedData: CachedSubscribedData,
                              tupleSelector: TupleSelector,
                              tuples: Tuple[]): void {
        // Pass the data on
        super.notifyObservers(cachedData, tupleSelector, tuples);
        // AND store the data locally
        this.storeDataLocally(tupleSelector, tuples);
    }

    private storeDataLocally(tupleSelector: TupleSelector, tuples: Tuple[]):Promise<void> {
        return this.tupleOfflineStorageService.saveTuples(tupleSelector, tuples)
            .catch(err => {
                this.statusService.logError(`saveTuples failed : ${err}`);
                throw new Error(err);
            });
    }
}

