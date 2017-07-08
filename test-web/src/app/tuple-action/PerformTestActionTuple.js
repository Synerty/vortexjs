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
var Tuple_1 = require("../../vortex/Tuple");
/** Perform Test Action Tuple
 *
 * This tuple is used for testing the action code.
 *
 */
var PerformTestActionTuple = PerformTestActionTuple_1 = (function (_super) {
    __extends(PerformTestActionTuple, _super);
    function PerformTestActionTuple() {
        var _this = _super.call(this, PerformTestActionTuple_1.tupleName) || this;
        _this.actionDataInt = 0;
        _this.actionDataUnicode = "";
        _this.failProcessing = false;
        return _this;
    }
    return PerformTestActionTuple;
}(Tuple_1.Tuple));
PerformTestActionTuple.tupleName = 'synerty.vortex.PerformTestActionTuple';
PerformTestActionTuple = PerformTestActionTuple_1 = __decorate([
    Tuple_1.addTupleType,
    __metadata("design:paramtypes", [])
], PerformTestActionTuple);
exports.PerformTestActionTuple = PerformTestActionTuple;
var PerformTestActionTuple_1;
//# sourceMappingURL=/home/peek/project/vortexjs/src/app/tuple-action/PerformTestActionTuple.js.map