import SerialiseUtil from "./SerialiseUtil";
import Jsonable from "./Jsonable";

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
export class Tuple extends Jsonable {
    public _tupleType: string;

    constructor(tupleType: string | null = null) {
        super();
        let self = this;
        self.__rapuiSerialiseType__ = SerialiseUtil.T_RAPUI_TUPLE;

        // Instantiate the correct class
        if (self._tupleType === undefined && TUPLE_TYPES[tupleType] !== undefined) {
            self._tupleType = tupleType;
            TUPLE_TYPES[tupleType].call(self);
        } else {
            self._tupleType = tupleType;
        }

    }
}

interface ITuple {
    new (name: string | null): Tuple;
}

export let TUPLE_TYPES = {};

export function registerTupleType(Class_: ITuple) {
    let inst = new Class_(null);
    TUPLE_TYPES[inst._tupleType] = Class_;
}