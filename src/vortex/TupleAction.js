"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Tuple_1 = require("./Tuple");
var TupleSelector_1 = require("./TupleSelector");
var TupleAction = (function (_super) {
    __extends(TupleAction, _super);
    function TupleAction() {
        var _this = _super.call(this, "vortex.TupleAction") || this;
        _this.uuid = Date.now() + Math.random();
        _this.dateTime = new Date();
        _this.tupleSelector = new TupleSelector_1.TupleSelector(null, {});
        _this.tupleChanges = [];
        _this.data = null;
        return _this;
    }
    return TupleAction;
}(Tuple_1.Tuple));
TupleAction = __decorate([
    Tuple_1.addTupleType,
    __metadata("design:paramtypes", [])
], TupleAction);
exports.TupleAction = TupleAction;
//# sourceMappingURL=/home/peek/project/vortexjs/src/vortex/TupleAction.js.map