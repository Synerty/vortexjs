import { TupleActionABC } from "./TupleAction";
import { Tuple } from "./Tuple";
export declare abstract class TupleActionProcessorDelegateABC {
    abstract processTupleAction(tupleAction: TupleActionABC): Promise<Tuple[]>;
}
