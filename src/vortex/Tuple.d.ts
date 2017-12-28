import Jsonable from "./Jsonable";
export interface TupleChangeI {
    fieldName: string;
    oldValue: any;
    newValue: any;
}
/** Tuples implementation details.
 *
 * We're not going to have fully fledged tuples in the browser. As far as the
 * browser is concerned, it will recieve tuples which will have all the fields
 * and then it will create tuples to send back, populating the fields it needs.
 *
 * There should be some checks when it gets back to the server to ensure the
 * populated fields exist in the tuples when it deserialises it.
 *
 */
export declare class Tuple extends Jsonable {
    _tupleType: string;
    private _ct;
    private _ctrs;
    constructor(tupleType?: string | null);
    _tupleName(): string;
    _setChangeTracking(on?: boolean): void;
    _detectedChanges(reset?: boolean): TupleChangeI[];
}
export declare let TUPLE_TYPES: {};
export declare function addTupleType(_Class: Function): void;
