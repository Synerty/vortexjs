import {Tuple, addTupleType} from "./Tuple";
import {TupleSelector} from "./TupleSelector";
import {VortexClientABC} from "./VortexClientABC";


export interface TupleActionChangeI {
    fieldName: string;
    oldValue: any;
    newValue: any;
}

@addTupleType
export class TupleAction extends Tuple {
    uuid:number = Date.now() +  Math.random();
    date = new Date();
    action: string | null = null;
    tupleSelector: TupleSelector = new TupleSelector(null, {});
    tupleChanges: TupleActionChangeI[] = [];

    constructor() {
        super("vortex.TupleAction");

    }

}
