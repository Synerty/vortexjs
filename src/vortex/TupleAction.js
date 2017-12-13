"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tuple_1 = require("./Tuple");
var TupleSelector_1 = require("./TupleSelector");
/** Tuple Action Base Class
 *
 *  A tuple action, represents an action the user or software wishes to perform.
 *  Actions have a specific destination they must reach. (as apposed to Observers)
 *
 *  @property key An optional key for this action
 *  @property data Some optional data for this action
 *
 * */
var TupleActionABC = (function (_super) {
    __extends(TupleActionABC, _super);
    function TupleActionABC(tupleName) {
        var _this = _super.call(this, tupleName) || this;
        _this.uuid = Date.now() + Math.random();
        _this.dateTime = new Date();
        return _this;
    }
    return TupleActionABC;
}(Tuple_1.Tuple));
exports.TupleActionABC = TupleActionABC;
/** Tuple Generic Action
 *
 *  This is a generic action, to be used when the implementor doesn't want to implement
 *  concrete classes for each action type.
 *
 *  @property key An optional key for this action
 *  @property data Some optional data for this action
 *
 * */
var TupleGenericAction = (function (_super) {
    __extends(TupleGenericAction, _super);
    function TupleGenericAction() {
        var _this = _super.call(this, "vortex.TupleGenericAction") || this;
        _this.key = null;
        _this.data = null;
        return _this;
    }
    TupleGenericAction = __decorate([
        Tuple_1.addTupleType,
        __metadata("design:paramtypes", [])
    ], TupleGenericAction);
    return TupleGenericAction;
}(TupleActionABC));
exports.TupleGenericAction = TupleGenericAction;
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
var TupleUpdateAction = (function (_super) {
    __extends(TupleUpdateAction, _super);
    function TupleUpdateAction() {
        var _this = _super.call(this, "vortex.TupleUpdateAction") || this;
        _this.tupleSelector = new TupleSelector_1.TupleSelector(null, {});
        _this.tupleChanges = [];
        _this.data = null;
        return _this;
    }
    TupleUpdateAction = __decorate([
        Tuple_1.addTupleType,
        __metadata("design:paramtypes", [])
    ], TupleUpdateAction);
    return TupleUpdateAction;
}(TupleActionABC));
exports.TupleUpdateAction = TupleUpdateAction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHVwbGVBY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJUdXBsZUFjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUEwRDtBQUMxRCxpREFBOEM7QUFHOUM7Ozs7Ozs7O0tBUUs7QUFDTDtJQUFvQyxrQ0FBSztJQUlyQyx3QkFBWSxTQUFpQjtRQUE3QixZQUNJLGtCQUFNLFNBQVMsQ0FBQyxTQUVuQjtRQU5ELFVBQUksR0FBVyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQzFDLGNBQVEsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDOztJQUt0QixDQUFDO0lBRUwscUJBQUM7QUFBRCxDQUFDLEFBVEQsQ0FBb0MsYUFBSyxHQVN4QztBQVRZLHdDQUFjO0FBVzNCOzs7Ozs7OztLQVFLO0FBRUw7SUFBd0Msc0NBQWM7SUFJbEQ7UUFBQSxZQUNJLGtCQUFNLDJCQUEyQixDQUFDLFNBRXJDO1FBTkQsU0FBRyxHQUFrQixJQUFJLENBQUM7UUFDMUIsVUFBSSxHQUFRLElBQUksQ0FBQzs7SUFLakIsQ0FBQztJQVBRLGtCQUFrQjtRQUQ5QixvQkFBWTs7T0FDQSxrQkFBa0IsQ0FTOUI7SUFBRCx5QkFBQztDQUFBLEFBVEQsQ0FBd0MsY0FBYyxHQVNyRDtBQVRZLGdEQUFrQjtBQVkvQjs7Ozs7Ozs7O0tBU0s7QUFFTDtJQUF1QyxxQ0FBYztJQUtqRDtRQUFBLFlBQ0ksa0JBQU0sMEJBQTBCLENBQUMsU0FFcEM7UUFQRCxtQkFBYSxHQUFrQixJQUFJLDZCQUFhLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzNELGtCQUFZLEdBQW1CLEVBQUUsQ0FBQztRQUNsQyxVQUFJLEdBQVEsSUFBSSxDQUFDOztJQUtqQixDQUFDO0lBUlEsaUJBQWlCO1FBRDdCLG9CQUFZOztPQUNBLGlCQUFpQixDQVU3QjtJQUFELHdCQUFDO0NBQUEsQUFWRCxDQUF1QyxjQUFjLEdBVXBEO0FBVlksOENBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthZGRUdXBsZVR5cGUsIFR1cGxlLCBUdXBsZUNoYW5nZUl9IGZyb20gXCIuL1R1cGxlXCI7XG5pbXBvcnQge1R1cGxlU2VsZWN0b3J9IGZyb20gXCIuL1R1cGxlU2VsZWN0b3JcIjtcblxuXG4vKiogVHVwbGUgQWN0aW9uIEJhc2UgQ2xhc3NcbiAqXG4gKiAgQSB0dXBsZSBhY3Rpb24sIHJlcHJlc2VudHMgYW4gYWN0aW9uIHRoZSB1c2VyIG9yIHNvZnR3YXJlIHdpc2hlcyB0byBwZXJmb3JtLlxuICogIEFjdGlvbnMgaGF2ZSBhIHNwZWNpZmljIGRlc3RpbmF0aW9uIHRoZXkgbXVzdCByZWFjaC4gKGFzIGFwcG9zZWQgdG8gT2JzZXJ2ZXJzKVxuICpcbiAqICBAcHJvcGVydHkga2V5IEFuIG9wdGlvbmFsIGtleSBmb3IgdGhpcyBhY3Rpb25cbiAqICBAcHJvcGVydHkgZGF0YSBTb21lIG9wdGlvbmFsIGRhdGEgZm9yIHRoaXMgYWN0aW9uXG4gKlxuICogKi9cbmV4cG9ydCBjbGFzcyBUdXBsZUFjdGlvbkFCQyBleHRlbmRzIFR1cGxlIHtcbiAgICB1dWlkOiBudW1iZXIgPSBEYXRlLm5vdygpICsgTWF0aC5yYW5kb20oKTtcbiAgICBkYXRlVGltZSA9IG5ldyBEYXRlKCk7XG5cbiAgICBjb25zdHJ1Y3Rvcih0dXBsZU5hbWU6IHN0cmluZykge1xuICAgICAgICBzdXBlcih0dXBsZU5hbWUpO1xuXG4gICAgfVxuXG59XG5cbi8qKiBUdXBsZSBHZW5lcmljIEFjdGlvblxuICpcbiAqICBUaGlzIGlzIGEgZ2VuZXJpYyBhY3Rpb24sIHRvIGJlIHVzZWQgd2hlbiB0aGUgaW1wbGVtZW50b3IgZG9lc24ndCB3YW50IHRvIGltcGxlbWVudFxuICogIGNvbmNyZXRlIGNsYXNzZXMgZm9yIGVhY2ggYWN0aW9uIHR5cGUuXG4gKlxuICogIEBwcm9wZXJ0eSBrZXkgQW4gb3B0aW9uYWwga2V5IGZvciB0aGlzIGFjdGlvblxuICogIEBwcm9wZXJ0eSBkYXRhIFNvbWUgb3B0aW9uYWwgZGF0YSBmb3IgdGhpcyBhY3Rpb25cbiAqXG4gKiAqL1xuQGFkZFR1cGxlVHlwZVxuZXhwb3J0IGNsYXNzIFR1cGxlR2VuZXJpY0FjdGlvbiBleHRlbmRzIFR1cGxlQWN0aW9uQUJDIHtcbiAgICBrZXk6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICAgIGRhdGE6IGFueSA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJ2b3J0ZXguVHVwbGVHZW5lcmljQWN0aW9uXCIpO1xuXG4gICAgfVxuXG59XG5cblxuLyoqIFR1cGxlIFVwZGF0ZSBBY3Rpb25cbiAqXG4gKiAgVGhpcyBpcyBhbiBhY3Rpb24gcmVwcmVzZW50aW5nIGFuIHVwZGF0ZSB0byBhIFR1cGxlLlxuICogIEl0J3Mgb3JpZ2luYWwgaW50ZW50aW9uIGlzIHRvIGJlIHVzZWQgdG8gc3RvcmUgb2ZmbGluZSB1cGRhdGVzLCB3aGljaCBjYW4gdGhlbiBiZVxuICogIGxhdGVyIGFwcGxpZWQgd2hlbiBpdCdzIG9ubGluZS5cbiAqXG4gKiAgQHByb3BlcnR5IGtleSBBbiBvcHRpb25hbCBrZXkgZm9yIHRoaXMgYWN0aW9uXG4gKiAgQHByb3BlcnR5IGRhdGEgU29tZSBvcHRpb25hbCBkYXRhIGZvciB0aGlzIGFjdGlvblxuICpcbiAqICovXG5AYWRkVHVwbGVUeXBlXG5leHBvcnQgY2xhc3MgVHVwbGVVcGRhdGVBY3Rpb24gZXh0ZW5kcyBUdXBsZUFjdGlvbkFCQyB7XG4gICAgdHVwbGVTZWxlY3RvcjogVHVwbGVTZWxlY3RvciA9IG5ldyBUdXBsZVNlbGVjdG9yKG51bGwsIHt9KTtcbiAgICB0dXBsZUNoYW5nZXM6IFR1cGxlQ2hhbmdlSVtdID0gW107XG4gICAgZGF0YTogYW55ID0gbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihcInZvcnRleC5UdXBsZVVwZGF0ZUFjdGlvblwiKTtcblxuICAgIH1cblxufVxuIl19