import SerialiseUtil from "./SerialiseUtil";
import Jsonable from "./Jsonable";
import { deepEqual, dictKeysFromObject } from "./UtilMisc";

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
export class Tuple extends Jsonable {
    public _tupleType: string;

    // Change Tracking Enabled - Shortened for memory conservation
    private _ct: boolean = false;

    // Change Tracking Reference State - Shortened for memory conservation
    private _ctrs: Tuple | null = null;

    constructor(tupleType: string | null = null) {
        super();
        let self = this;
        self.__rst = SerialiseUtil.T_RAPUI_TUPLE;
        self._tupleType = tupleType;
    }

    _tupleName(): string {
        return this._tupleType;
    }

    // ---------------
    // Start change detection code

    _setChangeTracking(on: boolean = true) {
        this._ctrs = new Tuple();
        this._ctrs.fromJsonDict(this.toJsonDict());
        this._ct = on;
    }

    _detectedChanges(reset: boolean = true): TupleChangeI[] {
        let changes = [];
        for (let key of dictKeysFromObject(this)) {
            let old_ = this._ctrs[key];
            let new_ = this[key];
            if (deepEqual(old_, new_)) continue;

            changes.push({
                fieldName: key,
                oldValue: old_,
                newValue: new_,
            });
        }

        if (reset) {
            this._setChangeTracking(true);
        }

        return changes;
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
