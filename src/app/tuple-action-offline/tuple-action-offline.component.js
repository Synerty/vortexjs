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
var core_1 = require("@angular/core");
var TupleAction_1 = require("../../vortex/TupleAction");
var TupleActionPushOfflineService_1 = require("../../vortex/TupleActionPushOfflineService");
var VortexStatusService_1 = require("../../vortex/VortexStatusService");
var PerformTestActionTuple_1 = require("../tuple-action/PerformTestActionTuple");
var TupleActionOfflineComponent = (function () {
    function TupleActionOfflineComponent(tupleActionOfflineService, vortexStatusService) {
        var _this = this;
        this.tupleActionOfflineService = tupleActionOfflineService;
        this.vortexStatusService = vortexStatusService;
        this.log = "Not started";
        this.count = -1;
        this.vortexIsOnline = false;
        // TODO: Unsubscribe this
        vortexStatusService.queuedActionCount.subscribe(function (count) { return _this.count = count; });
        this.count = vortexStatusService.snapshot.queuedActionCount;
        // TODO: Unsubscribe this
        vortexStatusService.errors.subscribe(function (errStr) { return _this.log = errStr; });
        // TODO: Unsubscribe this
        vortexStatusService.isOnline.subscribe(function (online) { return _this.vortexIsOnline = online; });
    }
    TupleActionOfflineComponent.prototype.ngOnInit = function () {
    };
    TupleActionOfflineComponent.prototype.sendSuccess = function () {
        var _this = this;
        var testTuple = new PerformTestActionTuple_1.PerformTestActionTuple();
        testTuple.actionDataInt = 111;
        testTuple._setChangeTracking();
        testTuple.actionDataInt = 112;
        testTuple.actionDataUnicode = "something";
        var tupleAction = new TupleAction_1.TupleUpdateAction();
        tupleAction.tupleSelector.name = testTuple._tupleName();
        tupleAction.tupleChanges = testTuple._detectedChanges();
        this.tupleActionOfflineService.pushAction(tupleAction)
            .then(function () { return _this.log = "SUCCESS : " + new Date(); })
            .catch(function (err) { return _this.log = "SUCCESS : " + new Date() + "\n" + err; });
    };
    TupleActionOfflineComponent.prototype.sendFail = function () {
        var _this = this;
        var tupleAction = new TupleAction_1.TupleGenericAction();
        tupleAction.key = PerformTestActionTuple_1.PerformTestActionTuple.tupleName;
        tupleAction.data = "FAIL PLEASE";
        this.tupleActionOfflineService.pushAction(tupleAction)
            .then(function () { return _this.log = "SUCCESS : " + new Date(); })
            .catch(function (err) { return _this.log = "FAILURE : " + new Date() + "\n" + err; });
    };
    return TupleActionOfflineComponent;
}());
TupleActionOfflineComponent = __decorate([
    core_1.Component({
        selector: 'app-tuple-action-offline',
        templateUrl: './tuple-action-offline.component.html',
        styleUrls: ['./tuple-action-offline.component.css']
    }),
    __metadata("design:paramtypes", [TupleActionPushOfflineService_1.TupleActionPushOfflineService,
        VortexStatusService_1.VortexStatusService])
], TupleActionOfflineComponent);
exports.TupleActionOfflineComponent = TupleActionOfflineComponent;
//# sourceMappingURL=/home/peek/project/vortexjs/src/app/tuple-action-offline/tuple-action-offline.component.js.map