"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        // Change Tracking Enabled - Shortened for memory conservation
        _this._ct = false;
        // Change Tracking Reference State - Shortened for memory conservation
        _this._ctrs = null;
        var self = _this;
        self.__rst = SerialiseUtil_1.default.T_RAPUI_TUPLE;
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
        this._ctrs = new Tuple();
        this._ctrs.fromJsonDict(this.toJsonDict());
        this._ct = on;
    };
    Tuple.prototype._detectedChanges = function (reset) {
        if (reset === void 0) { reset = true; }
        var changes = [];
        for (var _i = 0, _a = UtilMisc_1.dictKeysFromObject(this); _i < _a.length; _i++) {
            var key = _a[_i];
            var old_ = this._ctrs[key];
            var new_ = this[key];
            if (UtilMisc_1.deepEqual(old_, new_))
                continue;
            changes.push({
                "fieldName": key,
                "oldValue": old_,
                "newValue": new_
            });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHVwbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJUdXBsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlEQUE0QztBQUM1Qyx1Q0FBa0M7QUFDbEMsdUNBQXlEO0FBVXpEOzs7Ozs7Ozs7R0FTRztBQUNIO0lBQTJCLHlCQUFRO0lBUy9CLGVBQVksU0FBK0I7UUFBL0IsMEJBQUEsRUFBQSxnQkFBK0I7UUFBM0MsWUFDSSxpQkFBTyxTQVdWO1FBbEJELDhEQUE4RDtRQUN0RCxTQUFHLEdBQVksS0FBSyxDQUFDO1FBRTdCLHNFQUFzRTtRQUM5RCxXQUFLLEdBQWlCLElBQUksQ0FBQztRQUkvQixJQUFJLElBQUksR0FBRyxLQUFJLENBQUM7UUFDaEIsSUFBSSxDQUFDLEtBQUssR0FBRyx1QkFBYSxDQUFDLGFBQWEsQ0FBQztRQUV6QyxnQ0FBZ0M7UUFDaEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsS0FBSyxTQUFTLElBQUksbUJBQVcsQ0FBQyxTQUFTLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3hFLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO1lBQzVCLG1CQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO1FBQ2hDLENBQUM7O0lBQ0wsQ0FBQztJQUVELDBCQUFVLEdBQVY7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUMzQixDQUFDO0lBRUQsa0JBQWtCO0lBQ2xCLDhCQUE4QjtJQUU5QixrQ0FBa0IsR0FBbEIsVUFBbUIsRUFBa0I7UUFBbEIsbUJBQUEsRUFBQSxTQUFrQjtRQUNqQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDbEIsQ0FBQztJQUVELGdDQUFnQixHQUFoQixVQUFpQixLQUFxQjtRQUFyQixzQkFBQSxFQUFBLFlBQXFCO1FBQ2xDLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNqQixHQUFHLENBQUMsQ0FBWSxVQUF3QixFQUF4QixLQUFBLDZCQUFrQixDQUFDLElBQUksQ0FBQyxFQUF4QixjQUF3QixFQUF4QixJQUF3QjtZQUFuQyxJQUFJLEdBQUcsU0FBQTtZQUNSLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDM0IsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3JCLEVBQUUsQ0FBQyxDQUFDLG9CQUFTLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN0QixRQUFRLENBQUM7WUFFYixPQUFPLENBQUMsSUFBSSxDQUFDO2dCQUNULFdBQVcsRUFBRSxHQUFHO2dCQUNoQixVQUFVLEVBQUUsSUFBSTtnQkFDaEIsVUFBVSxFQUFFLElBQUk7YUFDbkIsQ0FBQyxDQUFDO1NBQ047UUFFRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ1IsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ2pDLENBQUM7UUFFRCxNQUFNLENBQUMsT0FBTyxDQUFBO0lBQ2xCLENBQUM7SUFFTCxZQUFDO0FBQUQsQ0FBQyxBQTFERCxDQUEyQixrQkFBUSxHQTBEbEM7QUExRFksc0JBQUs7QUFnRVAsUUFBQSxXQUFXLEdBQUcsRUFBRSxDQUFDO0FBRTVCLHNCQUE2QixNQUFnQjtJQUN6QyxJQUFJLElBQUksR0FBRyxJQUFVLE1BQU8sRUFBRSxDQUFDO0lBQy9CLG1CQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLE1BQU0sQ0FBQztBQUMxQyxDQUFDO0FBSEQsb0NBR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VyaWFsaXNlVXRpbCBmcm9tIFwiLi9TZXJpYWxpc2VVdGlsXCI7XG5pbXBvcnQgSnNvbmFibGUgZnJvbSBcIi4vSnNvbmFibGVcIjtcbmltcG9ydCB7ZGVlcEVxdWFsLCBkaWN0S2V5c0Zyb21PYmplY3R9IGZyb20gXCIuL1V0aWxNaXNjXCI7XG5cblxuZXhwb3J0IGludGVyZmFjZSBUdXBsZUNoYW5nZUkge1xuICAgIGZpZWxkTmFtZTogc3RyaW5nO1xuICAgIG9sZFZhbHVlOiBhbnk7XG4gICAgbmV3VmFsdWU6IGFueTtcbn1cblxuXG4vKiogVHVwbGVzIGltcGxlbWVudGF0aW9uIGRldGFpbHMuXG4gKlxuICogV2UncmUgbm90IGdvaW5nIHRvIGhhdmUgZnVsbHkgZmxlZGdlZCB0dXBsZXMgaW4gdGhlIGJyb3dzZXIuIEFzIGZhciBhcyB0aGVcbiAqIGJyb3dzZXIgaXMgY29uY2VybmVkLCBpdCB3aWxsIHJlY2lldmUgdHVwbGVzIHdoaWNoIHdpbGwgaGF2ZSBhbGwgdGhlIGZpZWxkc1xuICogYW5kIHRoZW4gaXQgd2lsbCBjcmVhdGUgdHVwbGVzIHRvIHNlbmQgYmFjaywgcG9wdWxhdGluZyB0aGUgZmllbGRzIGl0IG5lZWRzLlxuICpcbiAqIFRoZXJlIHNob3VsZCBiZSBzb21lIGNoZWNrcyB3aGVuIGl0IGdldHMgYmFjayB0byB0aGUgc2VydmVyIHRvIGVuc3VyZSB0aGVcbiAqIHBvcHVsYXRlZCBmaWVsZHMgZXhpc3QgaW4gdGhlIHR1cGxlcyB3aGVuIGl0IGRlc2VyaWFsaXNlcyBpdC5cbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBUdXBsZSBleHRlbmRzIEpzb25hYmxlIHtcbiAgICBwdWJsaWMgX3R1cGxlVHlwZTogc3RyaW5nO1xuXG4gICAgLy8gQ2hhbmdlIFRyYWNraW5nIEVuYWJsZWQgLSBTaG9ydGVuZWQgZm9yIG1lbW9yeSBjb25zZXJ2YXRpb25cbiAgICBwcml2YXRlIF9jdDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgLy8gQ2hhbmdlIFRyYWNraW5nIFJlZmVyZW5jZSBTdGF0ZSAtIFNob3J0ZW5lZCBmb3IgbWVtb3J5IGNvbnNlcnZhdGlvblxuICAgIHByaXZhdGUgX2N0cnM6IFR1cGxlIHwgbnVsbCA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3Rvcih0dXBsZVR5cGU6IHN0cmluZyB8IG51bGwgPSBudWxsKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5fX3JzdCA9IFNlcmlhbGlzZVV0aWwuVF9SQVBVSV9UVVBMRTtcblxuICAgICAgICAvLyBJbnN0YW50aWF0ZSB0aGUgY29ycmVjdCBjbGFzc1xuICAgICAgICBpZiAoc2VsZi5fdHVwbGVUeXBlID09PSB1bmRlZmluZWQgJiYgVFVQTEVfVFlQRVNbdHVwbGVUeXBlXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzZWxmLl90dXBsZVR5cGUgPSB0dXBsZVR5cGU7XG4gICAgICAgICAgICBUVVBMRV9UWVBFU1t0dXBsZVR5cGVdLmNhbGwoc2VsZik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWxmLl90dXBsZVR5cGUgPSB0dXBsZVR5cGU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfdHVwbGVOYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl90dXBsZVR5cGU7XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gU3RhcnQgY2hhbmdlIGRldGVjdGlvbiBjb2RlXG5cbiAgICBfc2V0Q2hhbmdlVHJhY2tpbmcob246IGJvb2xlYW4gPSB0cnVlKSB7XG4gICAgICAgIHRoaXMuX2N0cnMgPSBuZXcgVHVwbGUoKTtcbiAgICAgICAgdGhpcy5fY3Rycy5mcm9tSnNvbkRpY3QodGhpcy50b0pzb25EaWN0KCkpO1xuICAgICAgICB0aGlzLl9jdCA9IG9uO1xuICAgIH1cblxuICAgIF9kZXRlY3RlZENoYW5nZXMocmVzZXQ6IGJvb2xlYW4gPSB0cnVlKTogVHVwbGVDaGFuZ2VJW10ge1xuICAgICAgICBsZXQgY2hhbmdlcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBrZXkgb2YgZGljdEtleXNGcm9tT2JqZWN0KHRoaXMpKSB7XG4gICAgICAgICAgICBsZXQgb2xkXyA9IHRoaXMuX2N0cnNba2V5XTtcbiAgICAgICAgICAgIGxldCBuZXdfID0gdGhpc1trZXldO1xuICAgICAgICAgICAgaWYgKGRlZXBFcXVhbChvbGRfLCBuZXdfKSlcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICAgICAgY2hhbmdlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBcImZpZWxkTmFtZVwiOiBrZXksXG4gICAgICAgICAgICAgICAgXCJvbGRWYWx1ZVwiOiBvbGRfLFxuICAgICAgICAgICAgICAgIFwibmV3VmFsdWVcIjogbmV3X1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVzZXQpIHtcbiAgICAgICAgICAgIHRoaXMuX3NldENoYW5nZVRyYWNraW5nKHRydWUpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2hhbmdlc1xuICAgIH1cblxufVxuXG5pbnRlcmZhY2UgSVR1cGxlIHtcbiAgICBuZXcgKG5hbWU6IHN0cmluZyB8IG51bGwpOiBUdXBsZTtcbn1cblxuZXhwb3J0IGxldCBUVVBMRV9UWVBFUyA9IHt9O1xuXG5leHBvcnQgZnVuY3Rpb24gYWRkVHVwbGVUeXBlKF9DbGFzczogRnVuY3Rpb24pIHtcbiAgICBsZXQgaW5zdCA9IG5ldyAoPGFueT5fQ2xhc3MpKCk7XG4gICAgVFVQTEVfVFlQRVNbaW5zdC5fdHVwbGVUeXBlXSA9IF9DbGFzcztcbn0iXX0=