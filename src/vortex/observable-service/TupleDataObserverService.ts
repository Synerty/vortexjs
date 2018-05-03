import {Injectable} from "@angular/core";
import {Subject} from "rxjs/Subject";
import {Tuple} from "../Tuple";
import {TupleSelector} from "../TupleSelector";
import {TupleDataOfflineObserverService} from "./TupleDataOfflineObserverService";

export {TupleDataObservableNameService} from "./TupleDataOfflineObserverService";


@Injectable()
export class TupleDataObserverService {

    constructor(private delegate: TupleDataOfflineObserverService) {

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

