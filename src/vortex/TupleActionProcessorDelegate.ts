import {TupleActionABC} from "./TupleAction";
import {Tuple} from "./Tuple";


export abstract class TupleActionProcessorDelegateABC {

    abstract processTupleAction(tupleAction: TupleActionABC): Promise<Tuple[]> ;
}

