import {TupleAction} from "./TupleAction";
import {Tuple} from "./Tuple";


export abstract class TupleActionProcessorDelegateABC {

    abstract processTupleAction(tupleAction: TupleAction): Promise<Tuple[]> ;
}

