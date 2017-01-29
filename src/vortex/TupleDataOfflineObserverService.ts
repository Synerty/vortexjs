import {Injectable, NgZone} from "@angular/core";
import {Subject} from "rxjs";
import {VortexService} from "./VortexService";
import {Tuple} from "./Tuple";
import {TupleSelector} from "./TupleSelector";
import {VortexStatusService} from "./VortexStatusService";
import {TupleOfflineStorageService} from "./TupleOfflineStorageService";
import {
    TupleDataObservableNameService,
    TupleDataObserverService
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


        let subject = super.subscribeToTupleSelector(tupleSelector);


        // Make note of the first time the server receives data
        let subscriptionActive = subject.subscribe(() => {
            subscriptionActive.unsubscribe();
            subscriptionActive = null;
        });

        this.tupleOfflineStorageService.loadTuples(tupleSelector)
        // If the subscription is active, the server hasn't responded
        // when we emit, it will unsubscribe.
            .then((tuples: Tuple[]) => subscriptionActive != null && subject.next(tuples))
            .catch(err => {
                this.statusService.logError(`loadTuples failed : ${err}`);
                throw new Error(err);
            });

        return subject;
    }

    /** Update Offline State
     *
     * This method updates the offline stored data, which will be used until the next
     * update from the server comes along.
     * @param tupleSelector: The tuple selector to update tuples for
     * @param tuples: The new data to store
     */
    updateOfflineState(tupleSelector: TupleSelector, tuples: Tuple[]): void {
        this.tupleOfflineStorageService.saveTuples(tupleSelector, tuples);
    }

    protected notifyObservers(subject: Subject < Tuple[] >,
                              tupleSelector: TupleSelector,
                              tuples: Tuple[]): void {
        // Pass the data on
        super.notifyObservers(subject, tupleSelector, tuples);

        // AND store the data locally
        this.tupleOfflineStorageService.saveTuples(tupleSelector, tuples)
            .catch(err => {
                this.statusService.logError(`saveTuples failed : ${err}`);
                throw new Error(err);
            });
    }
}

