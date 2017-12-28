"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
var TupleActionABC = /** @class */ (function (_super) {
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
var TupleGenericAction = /** @class */ (function (_super) {
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
var TupleUpdateAction = /** @class */ (function (_super) {
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
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/TupleAction.js.map