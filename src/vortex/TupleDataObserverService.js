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
var CachedSubscribedData = (function () {
    function CachedSubscribedData() {
        this.subject = new rxjs_1.Subject();
        this.tuples = [];
        this.serverResponded = false;
    }
    return CachedSubscribedData;
}());
exports.CachedSubscribedData = CachedSubscribedData;
var TupleDataObserverService = (function (_super) {
    __extends(TupleDataObserverService, _super);
    function TupleDataObserverService(vortexService, statusService, zone, tupleDataObservableName) {
        var _this = _super.call(this) || this;
        _this.vortexService = vortexService;
        _this.statusService = statusService;
        _this.zone = zone;
        _this.cacheByTupleSelector = {};
        _this.filt = UtilMisc_1.extend({
            "name": tupleDataObservableName.name,
            "key": "tupleDataObservable"
        }, tupleDataObservableName.additionalFilt);
        _this.endpoint = new PayloadEndpoint_1.PayloadEndpoint(_this, _this.filt);
        _this.endpoint.observable.subscribe(function (payload) { return _this.receivePayload(payload); });
        statusService.isOnline
            .takeUntil(_this.onDestroyEvent)
            .filter(function (online) { return online === true; })
            .subscribe(function (online) { return _this.vortexOnlineChanged(); });
        // Cleanup dead subscribers every 30 seconds.
        var cleanupTimer = setInterval(function () { return _this.cleanupDeadCaches(); }, 30);
        _this.onDestroyEvent.subscribe(function () { return clearInterval(cleanupTimer); });
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
    TupleDataObserverService.prototype.subscribeToTupleSelector = function (tupleSelector) {
        var _this = this;
        var tsStr = tupleSelector.toOrderedJsonStr();
        if (this.cacheByTupleSelector.hasOwnProperty(tsStr)) {
            var cachedData_1 = this.cacheByTupleSelector[tsStr];
            // Emit the data 2 miliseconds later.
            setTimeout(function () {
                _this.notifyObservers(cachedData_1, tupleSelector, cachedData_1.tuples);
            }, 2);
            return cachedData_1.subject;
        }
        var newCahcedData = new CachedSubscribedData();
        this.cacheByTupleSelector[tsStr] = newCahcedData;
        this.tellServerWeWantData([tupleSelector]);
        return newCahcedData.subject;
    };
    TupleDataObserverService.prototype.cleanupDeadCaches = function () {
        for (var _i = 0, _a = UtilMisc_1.dictKeysFromObject(this.cacheByTupleSelector); _i < _a.length; _i++) {
            var key = _a[_i];
            var cachedData = this.cacheByTupleSelector[key];
            if (cachedData.subject.observers.length == 0)
                delete this.cacheByTupleSelector[key];
        }
    };
    TupleDataObserverService.prototype.vortexOnlineChanged = function () {
        this.cleanupDeadCaches();
        var tupleSelectors = [];
        for (var _i = 0, _a = UtilMisc_1.dictKeysFromObject(this.cacheByTupleSelector); _i < _a.length; _i++) {
            var key = _a[_i];
            tupleSelectors.push(TupleSelector_1.TupleSelector.fromJsonStr(key));
        }
        this.tellServerWeWantData(tupleSelectors);
    };
    TupleDataObserverService.prototype.receivePayload = function (payload) {
        var tupleSelector = payload.filt.tupleSelector;
        var tsStr = tupleSelector.toOrderedJsonStr();
        if (!this.cacheByTupleSelector.hasOwnProperty(tsStr))
            return;
        var cachedData = this.cacheByTupleSelector[tsStr];
        cachedData.tuples = payload.tuples;
        cachedData.serverResponded = true;
        this.notifyObservers(cachedData, tupleSelector, payload.tuples);
    };
    TupleDataObserverService.prototype.notifyObservers = function (cachedData, tupleSelector, tuples) {
        try {
            cachedData.subject.next(tuples);
        }
        catch (e) {
            // NOTE: Observables automatically remove observers when the raise exceptions.
            console.log("ERROR: TupleDataObserverService.notifyObservers, observable has been removed\n            " + e.toString() + "\n            " + tupleSelector.toOrderedJsonStr());
        }
    };
    TupleDataObserverService.prototype.tellServerWeWantData = function (tupleSelectors) {
        if (!this.statusService.snapshot.isOnline)
            return;
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
        VortexStatusService_1.VortexStatusService,
        core_1.NgZone,
        TupleDataObservableNameService])
], TupleDataObserverService);
exports.TupleDataObserverService = TupleDataObserverService;
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/TupleDataObserverService.js.map