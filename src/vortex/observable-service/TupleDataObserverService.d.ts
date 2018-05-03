import { Subject } from "rxjs/Subject";
import { Tuple } from "../Tuple";
import { TupleSelector } from "../TupleSelector";
import { TupleDataOfflineObserverService } from "./TupleDataOfflineObserverService";
export { TupleDataObservableNameService } from "./TupleDataOfflineObserverService";
export declare class TupleDataObserverService {
    private delegate;
    constructor(delegate: TupleDataOfflineObserverService);
    pollForTuples(tupleSelector: TupleSelector): Promise<Tuple[]>;
    subscribeToTupleSelector(tupleSelector: TupleSelector, enableCache?: boolean): Subject<Tuple[]>;
}
