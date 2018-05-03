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
var Subject_1 = require("rxjs/Subject");
var VortexService_1 = require("../VortexService");
var TupleSelector_1 = require("../TupleSelector");
var Payload_1 = require("../Payload");
var PayloadEndpoint_1 = require("../PayloadEndpoint");
var ComponentLifecycleEventEmitter_1 = require("../ComponentLifecycleEventEmitter");
var UtilMisc_1 = require("../UtilMisc");
var VortexStatusService_1 = require("../VortexStatusService");
var PayloadResponse_1 = require("../PayloadResponse");
var moment = require("moment");
var TupleOfflineStorageService_1 = require("../storage/TupleOfflineStorageService");
var TupleDataObservableNameService = /** @class */ (function () {
    function TupleDataObservableNameService(name, additionalFilt) {
        if (additionalFilt === void 0) { additionalFilt = {}; }
        this.name = name;
        this.additionalFilt = additionalFilt;
    }
    TupleDataObservableNameService.prototype.equals = function (other) {
        if (other == null)
            return false;
        if (this.name != other.name)
            return false;
        return JSON.stringify(this.additionalFilt) == JSON.stringify(other.additionalFilt);
    };
    TupleDataObservableNameService.prototype.toString = function () {
        return this.name + ":" + JSON.stringify(this.additionalFilt);
    };
    TupleDataObservableNameService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [String, Object])
    ], TupleDataObservableNameService);
    return TupleDataObservableNameService;
}());
exports.TupleDataObservableNameService = TupleDataObservableNameService;
var CachedSubscribedData = /** @class */ (function () {
    function CachedSubscribedData(tupleSelector) {
        this.tupleSelector = tupleSelector;
        this.subject = new Subject_1.Subject();
        // The date the cache is scheduled to be torn down.
        // This will be X time after we notice that it has no subscribers
        this.tearDownDate = null;
        this.TEARDOWN_WAIT = 120 * 1000; // 2 minutes, in milliseconds
        this.tuples = [];
        /** Last Server Payload Date
         * If the server has responded with a payload, this is the date in the payload
         * @type {Date | null}
         */
        this.lastServerPayloadDate = null;
        this.cacheEnabled = true;
        this.storageEnabled = true;
    }
    CachedSubscribedData.prototype.markForTearDown = function () {
        if (this.tearDownDate == null)
            this.tearDownDate = Date.now() + this.TEARDOWN_WAIT;
    };
    CachedSubscribedData.prototype.resetTearDown = function () {
        this.tearDownDate = null;
    };
    CachedSubscribedData.prototype.isReadyForTearDown = function () {
        return this.tearDownDate != null && this.tearDownDate <= Date.now();
    };
    return CachedSubscribedData;
}());
exports.CachedSubscribedData = CachedSubscribedData;
var TupleDataOfflineObserverService = /** @class */ (function (_super) {
    __extends(TupleDataOfflineObserverService, _super);
    function TupleDataOfflineObserverService(vortexService, vortexStatusService, tupleDataObservableName, tupleOfflineStorageService) {
        var _this = _super.call(this) || this;
        _this.vortexService = vortexService;
        _this.vortexStatusService = vortexStatusService;
        _this.tupleDataObservableName = tupleDataObservableName;
        _this.tupleOfflineStorageService = tupleOfflineStorageService;
        _this.cacheByTupleSelector = {};
        _this.filt = UtilMisc_1.extend({
            "name": tupleDataObservableName.name,
            "key": "tupleDataObservable"
        }, tupleDataObservableName.additionalFilt);
        _this.endpoint = new PayloadEndpoint_1.PayloadEndpoint(_this, _this.filt);
        _this.endpoint.observable
            .subscribe(function (payloadEnvelope) {
            payloadEnvelope
                .decodePayload()
                .then(function (payload) {
                _this.receivePayload(payload, payloadEnvelope.encodedPayload);
            })
                .catch(function (e) {
                console.log("TupleActionProcessorService:Error decoding payload " + e);
            });
        });
        vortexStatusService.isOnline
            .takeUntil(_this.onDestroyEvent)
            .filter(function (online) { return online === true; })
            .subscribe(function (online) { return _this.vortexOnlineChanged(); });
        // Cleanup dead subscribers every 30 seconds.
        var cleanupTimer = setInterval(function () { return _this.cleanupDeadCaches(); }, 30000);
        _this.onDestroyEvent.subscribe(function () { return clearInterval(cleanupTimer); });
        return _this;
    }
    TupleDataOfflineObserverService.prototype._nameService = function () {
        return this.tupleDataObservableName;
    };
    TupleDataOfflineObserverService.prototype.pollForTuples = function (tupleSelector) {
        var _this = this;
        var startFilt = UtilMisc_1.extend({ "subscribe": false }, this.filt, {
            "tupleSelector": tupleSelector
        });
        // Optionally typed, No need to worry about the fact that we convert this
        // and then TypeScript doesn't recognise that data type change
        var promise = new Payload_1.Payload(startFilt).makePayloadEnvelope();
        promise = promise.then(function (payloadEnvelope) {
            return new PayloadResponse_1.PayloadResponse(_this.vortexService, payloadEnvelope);
        });
        promise = promise.then(function (payloadEnvelope) {
            return payloadEnvelope.decodePayload();
        });
        promise = promise.then(function (payload) { return payload.tuples; });
        return promise;
    };
    TupleDataOfflineObserverService.prototype.subscribeToTupleSelector = function (tupleSelector, enableCache, enableStorage) {
        var _this = this;
        if (enableCache === void 0) { enableCache = true; }
        if (enableStorage === void 0) { enableStorage = true; }
        var tsStr = tupleSelector.toOrderedJsonStr();
        if (this.cacheByTupleSelector.hasOwnProperty(tsStr)) {
            var cachedData_1 = this.cacheByTupleSelector[tsStr];
            cachedData_1.resetTearDown();
            cachedData_1.cacheEnabled = cachedData_1.cacheEnabled && enableCache;
            cachedData_1.storageEnabled = cachedData_1.storageEnabled && enableStorage;
            if (cachedData_1.cacheEnabled && cachedData_1.lastServerPayloadDate != null) {
                // Emit after we return
                setTimeout(function () {
                    _this.notifyObservers(cachedData_1, tupleSelector, cachedData_1.tuples);
                }, 0);
            }
            else {
                cachedData_1.tuples = [];
                this.tellServerWeWantData([tupleSelector], enableCache);
            }
            return cachedData_1.subject;
        }
        var newCachedData = new CachedSubscribedData(tupleSelector);
        newCachedData.cacheEnabled = enableCache;
        newCachedData.storageEnabled = enableStorage;
        this.cacheByTupleSelector[tsStr] = newCachedData;
        this.tellServerWeWantData([tupleSelector], enableCache);
        if (newCachedData.storageEnabled) {
            this.tupleOfflineStorageService
                .loadTuples(tupleSelector)
                .then(function (tuples) {
                // If the server has responded before we loaded the data, then just
                // ignore the cached data.
                if (newCachedData.lastServerPayloadDate != null)
                    return;
                // Update the tuples, and notify if them
                newCachedData.tuples = tuples;
                _this.notifyObservers(newCachedData, tupleSelector, tuples);
            })
                .catch(function (err) {
                _this.vortexStatusService.logError("loadTuples failed : " + err);
                throw new Error(err);
            });
        }
        return newCachedData.subject;
    };
    /** Update Offline State
     *
     * This method updates the offline stored data, which will be used until the next
     * update from the server comes along.
     * @param tupleSelector: The tuple selector to update tuples for
     * @param tuples: The new data to store
     */
    TupleDataOfflineObserverService.prototype.updateOfflineState = function (tupleSelector, tuples) {
        // AND store the data locally
        this.storeDataLocally(tupleSelector, tuples);
        var tsStr = tupleSelector.toOrderedJsonStr();
        if (this.cacheByTupleSelector.hasOwnProperty(tsStr)) {
            var cachedData = this.cacheByTupleSelector[tsStr];
            cachedData.tuples = tuples;
            this.notifyObservers(cachedData, tupleSelector, tuples);
        }
    };
    TupleDataOfflineObserverService.prototype.cleanupDeadCaches = function () {
        for (var _i = 0, _a = UtilMisc_1.dictKeysFromObject(this.cacheByTupleSelector); _i < _a.length; _i++) {
            var key = _a[_i];
            var cachedData = this.cacheByTupleSelector[key];
            if (cachedData.subject.observers.length != 0) {
                cachedData.resetTearDown();
            }
            else {
                if (cachedData.isReadyForTearDown()) {
                    delete this.cacheByTupleSelector[key];
                    this.tellServerWeWantData([cachedData.tupleSelector], cachedData.cacheEnabled, true);
                }
                else {
                    cachedData.markForTearDown();
                }
            }
        }
    };
    TupleDataOfflineObserverService.prototype.vortexOnlineChanged = function () {
        this.cleanupDeadCaches();
        var tupleSelectors = [];
        for (var _i = 0, _a = UtilMisc_1.dictKeysFromObject(this.cacheByTupleSelector); _i < _a.length; _i++) {
            var key = _a[_i];
            tupleSelectors.push(TupleSelector_1.TupleSelector.fromJsonStr(key));
        }
        this.tellServerWeWantData(tupleSelectors);
    };
    TupleDataOfflineObserverService.prototype.receivePayload = function (payload, encodedPayload) {
        var tupleSelector = payload.filt["tupleSelector"];
        var tsStr = tupleSelector.toOrderedJsonStr();
        if (!this.cacheByTupleSelector.hasOwnProperty(tsStr))
            return;
        var cachedData = this.cacheByTupleSelector[tsStr];
        var lastDate = cachedData.lastServerPayloadDate;
        if (payload.date == null) {
            throw new Error("payload.date can not be null");
        }
        var thisDate = moment(payload.date);
        // If the data is old, then disregard it.
        if (lastDate != null && lastDate.isAfter(thisDate))
            return;
        cachedData.lastServerPayloadDate = thisDate;
        cachedData.tuples = payload.tuples;
        this.notifyObservers(cachedData, tupleSelector, payload.tuples, encodedPayload);
    };
    TupleDataOfflineObserverService.prototype.tellServerWeWantData = function (tupleSelectors, enableCache, unsubscribe) {
        if (enableCache === void 0) { enableCache = true; }
        if (unsubscribe === void 0) { unsubscribe = false; }
        if (!this.vortexStatusService.snapshot.isOnline)
            return;
        var startFilt = UtilMisc_1.extend({ "subscribe": true }, this.filt);
        var payloads = [];
        for (var _i = 0, tupleSelectors_1 = tupleSelectors; _i < tupleSelectors_1.length; _i++) {
            var tupleSelector = tupleSelectors_1[_i];
            var filt = UtilMisc_1.extend({}, startFilt, {
                "tupleSelector": tupleSelector,
                "enableCache": enableCache,
                "unsubscribe": unsubscribe
            });
            payloads.push(new Payload_1.Payload(filt));
        }
        this.vortexService.sendPayload(payloads);
    };
    TupleDataOfflineObserverService.prototype.notifyObservers = function (cachedData, tupleSelector, tuples, encodedPayload) {
        if (encodedPayload === void 0) { encodedPayload = null; }
        // Notify Observers
        try {
            cachedData.subject.next(tuples);
        }
        catch (e) {
            // NOTE: Observables automatically remove observers when the raise exceptions.
            console.log("ERROR: TupleDataObserverService.notifyObservers, observable has been removed\n            " + e.toString() + "\n            " + tupleSelector.toOrderedJsonStr());
        }
        // AND store the data locally
        if (cachedData.storageEnabled)
            this.storeDataLocally(tupleSelector, tuples, encodedPayload);
    };
    TupleDataOfflineObserverService.prototype.storeDataLocally = function (tupleSelector, tuples, encodedPayload) {
        var _this = this;
        if (encodedPayload === void 0) { encodedPayload = null; }
        var errFunc = function (err) {
            _this.vortexStatusService.logError("saveTuples failed : " + err);
            throw new Error(err);
        };
        if (encodedPayload == null) {
            return this.tupleOfflineStorageService.saveTuples(tupleSelector, tuples)
                .catch(errFunc);
        }
        this.tupleOfflineStorageService.saveTuplesEncoded(tupleSelector, encodedPayload)
            .catch(errFunc);
    };
    TupleDataOfflineObserverService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [VortexService_1.VortexService,
            VortexStatusService_1.VortexStatusService,
            TupleDataObservableNameService,
            TupleOfflineStorageService_1.TupleOfflineStorageService])
    ], TupleDataOfflineObserverService);
    return TupleDataOfflineObserverService;
}(ComponentLifecycleEventEmitter_1.ComponentLifecycleEventEmitter));
exports.TupleDataOfflineObserverService = TupleDataOfflineObserverService;
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/observable-service/TupleDataOfflineObserverService.js.map