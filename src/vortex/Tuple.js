var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var Tuple = (function (_super) {
    __extends(Tuple, _super);
    function Tuple(tupleType) {
        if (tupleType === void 0) { tupleType = null; }
        var _this = _super.call(this) || this;
        var self = _this;
        self.__rapuiSerialiseType__ = SerialiseUtil.T_RAPUI_TUPLE;
        // Instantiate the correct class
        if (self._tupleType === undefined && TUPLE_TYPES[tupleType] !== undefined) {
            self._tupleType = tupleType;
            TUPLE_TYPES[tupleType].call(self);
        }
        else {
            self._tupleType = tupleType;
        }
        return _this;
    }
    return Tuple;
}(Jsonable));
export { Tuple };
export var TUPLE_TYPES = {};
export function registerTupleType(Class_) {
    var inst = new Class_(null);
    TUPLE_TYPES[inst._tupleType] = Class_;
}
//# sourceMappingURL=/home/peek/project/vortexjs/src/src/vortex/Tuple.js.map