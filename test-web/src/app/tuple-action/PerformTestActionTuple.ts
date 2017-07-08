import {addTupleType, Tuple} from "../../vortex/Tuple";

/** Perform Test Action Tuple
 *
 * This tuple is used for testing the action code.
 *
 */
@addTupleType
export class PerformTestActionTuple extends Tuple {
    public static tupleName = 'synerty.vortex.PerformTestActionTuple';
    actionDataInt: number = 0;
    actionDataUnicode: string = "";
    failProcessing: boolean = false;

    constructor() {
        super(PerformTestActionTuple.tupleName);
    }
}