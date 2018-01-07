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

    subscribeToTupleSelector(tupleSelector: TupleSelector): Subject<Tuple[]> {

        let tsStr = tupleSelector.toOrderedJsonStr();

        if (this.cacheByTupleSelector.hasOwnProperty(tsStr)) {
            let cachedData = this.cacheByTupleSelector[tsStr];

            // Emit the data 2 miliseconds later.
            setTimeout(() => {
                super.notifyObservers(cachedData, tupleSelector, cachedData.tuples);
            }, 2);

            return cachedData.subject;
        }

        let newCahcedData = new CachedSubscribedData();
        this.cacheByTupleSelector[tsStr] = newCahcedData;

        this.tellServerWeWantData([tupleSelector]);

        this.tupleOfflineStorageService
          .loadTuples(tupleSelector)
            .then((tuples: Tuple[]) => {
               // If the server has responded before we loaded the data, then just
               // ignore the cached data.
               if (newCahcedData.serverResponded)
                 return;

               // Update the tuples, and notify if them
               newCahcedData.tuples = tuples;
               super.notifyObservers(newCahcedData, tupleSelector, tuples);
            })
            .catch(err => {
                this.statusService.logError(`loadTuples failed : ${err}`);
                throw new Error(err);
            });

        return newCahcedData.subject;
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

