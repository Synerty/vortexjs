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
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var VortexService_1 = require("./VortexService");
var TupleSelector_1 = require("./TupleSelector");
var Payload_1 = require("./Payload");
var PayloadEndpoint_1 = require("./PayloadEndpoint");
var ComponentLifecycleEventEmitter_1 = require("./ComponentLifecycleEventEmitter");
var UtilMisc_1 = require("./UtilMisc");
var VortexStatusService_1 = require("./VortexStatusService");
var PayloadResponse_1 = require("./PayloadResponse");
var TupleDataObservableNameService = (function () {
    function TupleDataObservableNameService(name, additionalFilt) {
        if (additionalFilt === void 0) { additionalFilt = {}; }
        this.name = name;
        this.additionalFilt = additionalFilt;
    }
    return TupleDataObservableNameService;
}());
TupleDataObservableNameService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [String, Object])
], TupleDataObservableNameService);
exports.TupleDataObservableNameService = TupleDataObservableNameService;
var TupleDataObserverService = (function (_super) {
    __extends(TupleDataObserverService, _super);
    function TupleDataObserverService(vortexService, statusService, zone, tupleDataObservableName) {
        var _this = _super.call(this) || this;
        _this.vortexService = vortexService;
        _this.statusService = statusService;
        _this.zone = zone;
        _this.subjectsByTupleSelector = {};
        _this.filt = UtilMisc_1.extend({
            "name": tupleDataObservableName.name,
            "key": "tupleDataObservable"
        }, tupleDataObservableName.additionalFilt);
        _this.endpoint = new PayloadEndpoint_1.PayloadEndpoint(_this, _this.filt);
        _this.endpoint.observable.subscribe(function (payload) { return _this.receivePayload(payload); });
        var isOnlineSub = statusService.isOnline
            .filter(function (online) { return online === true; })
            .subscribe(function (online) { return _this.vortexOnlineChanged(); });
        _this.onDestroyEvent.subscribe(function () { return isOnlineSub.unsubscribe(); });
        return _this;
    }
    TupleDataObserverService.prototype.pollForTuples = function (tupleSelector) {
        var startFilt = UtilMisc_1.extend({ "subscribe": false }, this.filt, {
            "tupleSelector": tupleSelector
        });
        // Optionally typed, No need to worry about the fact that we convert this
        // and then TypeScript doesn't recignise that data type change
        var promise = new PayloadResponse_1.PayloadResponse(this.vortexService, new Payload_1.Payload(startFilt))
            .then(function (payload) { return payload.tuples; });
        return promise;
    };
    TupleDataObserverService.prototype.subjectForTupleSelector = function (tupleSelector) {
        var tsStr = tupleSelector.toOrderedJsonStr();
        if (this.subjectsByTupleSelector.hasOwnProperty(tsStr))
            return this.subjectsByTupleSelector[tsStr];
        var newSubject = new rxjs_1.Subject();
        this.subjectsByTupleSelector[tsStr] = newSubject;
        return newSubject;
    };
    TupleDataObserverService.prototype.subscribeToTupleSelector = function (tupleSelector) {
        var newSubject = this.subjectForTupleSelector(tupleSelector);
        this.tellServerWeWantData([tupleSelector]);
        return newSubject;
    };
    TupleDataObserverService.prototype.vortexOnlineChanged = function () {
        var tupleSelectors = [];
        for (var _i = 0, _a = UtilMisc_1.dictKeysFromObject(this.subjectsByTupleSelector); _i < _a.length; _i++) {
            var key = _a[_i];
            tupleSelectors.push(TupleSelector_1.TupleSelector.fromJsonStr(key));
        }
        this.tellServerWeWantData(tupleSelectors);
    };
    TupleDataObserverService.prototype.receivePayload = function (payload) {
        var tupleSelector = payload.filt.tupleSelector;
        var tsStr = tupleSelector.toOrderedJsonStr();
        if (!this.subjectsByTupleSelector.hasOwnProperty(tsStr))
            return;
        var subject = this.subjectsByTupleSelector[tsStr];
        this.notifyObservers(subject, tupleSelector, payload.tuples);
    };
    TupleDataObserverService.prototype.notifyObservers = function (subject, tupleSelector, tuples) {
        this.zone.run(function () { return subject.next(tuples); });
    };
    TupleDataObserverService.prototype.tellServerWeWantData = function (tupleSelectors) {
        var startFilt = UtilMisc_1.extend({ "subscribe": true }, this.filt);
        var payloads = [];
        for (var _i = 0, tupleSelectors_1 = tupleSelectors; _i < tupleSelectors_1.length; _i++) {
            var tupleSelector = tupleSelectors_1[_i];
            var filt = UtilMisc_1.extend({}, startFilt, {
                "tupleSelector": tupleSelector
            });
            payloads.push(new Payload_1.Payload(filt));
        }
        this.vortexService.sendPayload(payloads);
    };
    return TupleDataObserverService;
}(ComponentLifecycleEventEmitter_1.ComponentLifecycleEventEmitter));
TupleDataObserverService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [VortexService_1.VortexService,
        VortexStatusService_1.VortexStatusService, typeof (_a = typeof core_1.NgZone !== "undefined" && core_1.NgZone) === "function" && _a || Object, TupleDataObservableNameService])
], TupleDataObserverService);
exports.TupleDataObserverService = TupleDataObserverService;
var _a;
//# sourceMappingURL=/home/peek/project/vortexjs/src/vortex/TupleDataObserverService.js.map