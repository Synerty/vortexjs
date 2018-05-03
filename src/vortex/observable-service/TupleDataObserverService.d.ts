import { Subject } from "rxjs/Subject";
import { Tuple } from "../Tuple";
import { TupleSelector } from "../TupleSelector";
import { TupleDataObservableNameService, TupleDataOfflineObserverService } from "./TupleDataOfflineObserverService";
export { TupleDataObservableNameService } from "./TupleDataOfflineObserverService";
export declare class TupleDataObserverService {
    private delegate;
    private tupleDataObservableName;
    constructor(delegate: TupleDataOfflineObserverService, tupleDataObservableName: TupleDataObservableNameService);
    pollForTuples(tupleSelector: TupleSelector): Promise<Tuple[]>;
    subscribeToTupleSelector(tupleSelector: TupleSelector, enableCache?: boolean): Subject<Tuple[]>;
}
