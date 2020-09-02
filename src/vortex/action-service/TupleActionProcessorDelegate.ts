import { TupleActionABC } from "../TupleAction"
import { Tuple } from "../exports"

export abstract class TupleActionProcessorDelegateABC {
    
    abstract processTupleAction(tupleAction: TupleActionABC): Promise<Tuple[]> ;
}

