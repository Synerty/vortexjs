import {Tuple, addTupleType, TupleChangeI} from "./Tuple";
import {TupleSelector} from "./TupleSelector";


@addTupleType
export class TupleAction extends Tuple {
    uuid: number = Date.now() + Math.random();
    dateTime = new Date();
    tupleSelector: TupleSelector = new TupleSelector(null, {});
    tupleChanges: TupleChangeI[] = [];
    data: any = null;

    constructor() {
        super("vortex.TupleAction");

    }

}
