"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SerialiseUtil_1 = require("./SerialiseUtil");
var Jsonable_1 = require("./Jsonable");
var UtilMisc_1 = require("./UtilMisc");
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
        _this._changeTracking = false;
        _this._changeTrackingReferenceState = null;
        var self = _this;
        self.__rapuiSerialiseType__ = SerialiseUtil_1.default.T_RAPUI_TUPLE;
        // Instantiate the correct class
        if (self._tupleType === undefined && exports.TUPLE_TYPES[tupleType] !== undefined) {
            self._tupleType = tupleType;
            exports.TUPLE_TYPES[tupleType].call(self);
        }
        else {
            self._tupleType = tupleType;
        }
        return _this;
    }
    Tuple.prototype._tupleName = function () {
        return this._tupleType;
    };
    // ---------------
    // Start change detection code
    Tuple.prototype._setChangeTracking = function (on) {
        if (on === void 0) { on = true; }
        this._changeTrackingReferenceState = {};
        for (var _i = 0, _a = UtilMisc_1.dictKeysFromObject(this); _i < _a.length; _i++) {
            var key = _a[_i];
            this._changeTrackingReferenceState[key] = UtilMisc_1.deepCopy(this[key]);
        }
        this._changeTracking = on;
    };
    Tuple.prototype._detectedChanges = function (reset) {
        if (reset === void 0) { reset = true; }
        var changes = null;
        for (var _i = 0, _a = UtilMisc_1.dictKeysFromObject(this); _i < _a.length; _i++) {
            var key = _a[_i];
            var old_ = this._changeTrackingReferenceState[key];
            var new_ = this[key];
            if (UtilMisc_1.deepEqual(old_, new_))
                continue;
            if (changes === null)
                changes = {};
            changes[key] = {
                "old": old_,
                "new": new_
            };
        }
        if (reset) {
            this._setChangeTracking(true);
        }
        return changes;
    };
    return Tuple;
}(Jsonable_1.default));
exports.Tuple = Tuple;
exports.TUPLE_TYPES = {};
function addTupleType(_Class) {
    var inst = new _Class();
    exports.TUPLE_TYPES[inst._tupleType] = _Class;
}
exports.addTupleType = addTupleType;
//# sourceMappingURL=/home/peek/project/vortexjs/src/vortex/Tuple.js.map