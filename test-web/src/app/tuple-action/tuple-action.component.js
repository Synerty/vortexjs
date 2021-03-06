"use strict";
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
var core_1 = require("@angular/core");
var TupleActionPushService_1 = require("../../vortex/TupleActionPushService");
var TupleAction_1 = require("../../vortex/TupleAction");
var PerformTestActionTuple_1 = require("./PerformTestActionTuple");
var TupleActionComponent = (function () {
    function TupleActionComponent(tupleActionService) {
        this.tupleActionService = tupleActionService;
        this.log = "Not started";
    }
    TupleActionComponent.prototype.ngOnInit = function () {
    };
    TupleActionComponent.prototype.sendSuccess = function () {
        var _this = this;
        var testTuple = new PerformTestActionTuple_1.PerformTestActionTuple();
        testTuple.actionDataInt = 111;
        testTuple._setChangeTracking();
        testTuple.actionDataInt = 112;
        testTuple.actionDataUnicode = "something";
        var tupleAction = new TupleAction_1.TupleUpdateAction();
        tupleAction.tupleSelector.name = testTuple._tupleName();
        tupleAction.tupleChanges = testTuple._detectedChanges();
        this.tupleActionService.pushAction(tupleAction)
            .then(function () { return _this.log = "SUCCESS : " + new Date(); })
            .catch(function (err) { return _this.log = "SUCCESS : " + new Date() + "\n" + err; });
    };
    TupleActionComponent.prototype.sendFail = function () {
        var _this = this;
        var tupleAction = new TupleAction_1.TupleGenericAction();
        tupleAction.key = PerformTestActionTuple_1.PerformTestActionTuple.tupleName;
        tupleAction.data = "FAIL PLEASE";
        this.tupleActionService.pushAction(tupleAction)
            .then(function () { return _this.log = "SUCCESS : " + new Date(); })
            .catch(function (err) { return _this.log = "FAILURE : " + new Date() + "\n" + err; });
    };
    return TupleActionComponent;
}());
TupleActionComponent = __decorate([
    core_1.Component({
        selector: 'app-tuple-action',
        templateUrl: './tuple-action.component.html',
        styleUrls: ['./tuple-action.component.css']
    }),
    __metadata("design:paramtypes", [TupleActionPushService_1.TupleActionPushService])
], TupleActionComponent);
exports.TupleActionComponent = TupleActionComponent;
//# sourceMappingURL=/home/peek/project/vortexjs/src/app/tuple-action/tuple-action.component.js.map