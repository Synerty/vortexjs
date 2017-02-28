import { Tuple } from "../../vortex/Tuple";
/** Perform Test Action Tuple
 *
 * This tuple is used for testing the action code.
 *
 */
export declare class PerformTestActionTuple extends Tuple {
    static tupleName: string;
    actionDataInt: number;
    actionDataUnicode: string;
    failProcessing: boolean;
    constructor();
}
