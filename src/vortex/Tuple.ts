import SerialiseUtil from "./SerialiseUtil";
import Jsonable from "./Jsonable";
import {deepEqual, deepCopy, dictKeysFromObject} from "./UtilMisc";


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
    private _changeTracking: boolean = false;
    private _changeTrackingReferenceState: {} | null = null;

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

    _tupleName(): string {
        return this._tupleType;
    }

    // ---------------
    // Start change detection code

    _setChangeTracking(on: boolean = true) {
        this._changeTrackingReferenceState = {};
        for (let key of dictKeysFromObject(this)) {
            this._changeTrackingReferenceState[key] = deepCopy(this[key]);
        }
        this._changeTracking = on;
    }

    _detectedChanges(reset: boolean = true): { [name: string]: any } | null {
        let changes = null;
        for (let key of dictKeysFromObject(this)) {
            let old_ = this._changeTrackingReferenceState[key];
            let new_ = this[key];
            if (deepEqual(old_, new_))
                continue;

            if (changes === null)
                changes = {};

            changes[key] = {
                "old": old_,
                "new": new_
            };
        }

        if (reset) {
            this._setChangeTracking(true)
        }

        return changes
    }

}

interface ITuple {
    new (name: string | null): Tuple;
}

export let TUPLE_TYPES = {};

export function addTupleType(_Class: Function) {
    let inst = new (<any>_Class)();
    TUPLE_TYPES[inst._tupleType] = _Class;
}