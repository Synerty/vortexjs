import {addTupleType, Tuple, TupleChangeI} from "./exports";
import {TupleSelector} from "./TupleSelector";


/** Tuple Action Base Class
 *
 *  A tuple action, represents an action the user or software wishes to perform.
 *  Actions have a specific destination they must reach. (as apposed to Observers)
 *
 *  @property key An optional key for this action
 *  @property data Some optional data for this action
 *
 * */
export class TupleActionABC extends Tuple {
    uuid: number = Date.now() + Math.random();
    dateTime = new Date();

    constructor(tupleName: string) {
        super(tupleName);

    }

}

/** Tuple Generic Action
 *
 *  This is a generic action, to be used when the implementor doesn't want to implement
 *  concrete classes for each action type.
 *
 *  @property key An optional key for this action
 *  @property data Some optional data for this action
 *
 * */
@addTupleType
export class TupleGenericAction extends TupleActionABC {
    key: string | null = null;
    data: any = null;

    constructor() {
        super("vortex.TupleGenericAction");

    }

}


/** Tuple Update Action
 *
 *  This is an action representing an update to a Tuple.
 *  It's original intention is to be used to store offline updates, which can then be
 *  later applied when it's online.
 *
 *  @property key An optional key for this action
 *  @property data Some optional data for this action
 *
 * */
@addTupleType
export class TupleUpdateAction extends TupleActionABC {
    tupleSelector: TupleSelector = new TupleSelector(null, {});
    tupleChanges: TupleChangeI[] = [];
    data: any = null;

    constructor() {
        super("vortex.TupleUpdateAction");

    }

}
