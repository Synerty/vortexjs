import {Injectable} from "@angular/core";
import {Subject} from "rxjs/Subject";
import {Tuple} from "../Tuple";
import {TupleSelector} from "../TupleSelector";
import {
    TupleDataObservableNameService,
    TupleDataOfflineObserverService
} from "./TupleDataOfflineObserverService";

export {TupleDataObservableNameService} from "./TupleDataOfflineObserverService";


@Injectable()
export class TupleDataObserverService {

    constructor(private delegate: TupleDataOfflineObserverService,
                private tupleDataObservableName: TupleDataObservableNameService) {
        let delegateName = delegate._nameService();
        if (!this.tupleDataObservableName.equals(delegateName)) {
            throw new Error("ERROR: The TupleDataObserverService was injected"
                + " with the wrong TupleDataOfflineObserverService name service"
                + ` ${delegateName} VS ${this.tupleDataObservableName}`
                + " ensure TupleDataOfflineObserverService is provided first."
            );
        }


    }

    pollForTuples(tupleSelector: TupleSelector): Promise<Tuple[]> {
        return this.delegate.pollForTuples(tupleSelector);
    }

    subscribeToTupleSelector(tupleSelector: TupleSelector,
                             enableCache: boolean = true): Subject<Tuple[]> {
        return this.delegate.subscribeToTupleSelector(
            tupleSelector, enableCache, false)
    }
}

