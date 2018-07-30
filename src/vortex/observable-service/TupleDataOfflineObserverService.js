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
var operators_1 = require("rxjs/operators");
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
        this.subject = new rxjs_1.Subject();
        /** Last Server Payload Date
         * If the server has responded with a payload, this is the date in the payload
         * @type {Date | null}
         */
        this.lastServerPayloadDate = null;
        this.lastServerAskDate = null;
        this.cacheEnabled = true;
        this.storageEnabled = true;
        this.askServerEnabled = true;
        // The date the cache is scheduled to be torn down.
        // This will be X time after we notice that it has no subscribers
        this.tearDownDate = null;
        this.TEARDOWN_WAIT = 30 * 1000; // 30 seconds, in milliseconds
        this._tuples = null;
        /** Last Touched
         *
         * The last date that this cache was touched (subscribed or updated)
         * @type {Date | null}
         */
        this.FLUSH_WAIT = 120 * 1000; // 2 minutes, in milliseconds
        this._lastTouched = null;
        this.touch();
    }
    CachedSubscribedData.prototype.markForTearDown = function () {
        if (this.tearDownDate == null)
            this.tearDownDate = Date.now();
    };
    CachedSubscribedData.prototype.resetTearDown = function () {
        this.tearDownDate = null;
        this.touch();
    };
    CachedSubscribedData.prototype.isReadyForTearDown = function () {
        return this.tearDownDate != null
            && (this.tearDownDate + this.TEARDOWN_WAIT) <= Date.now();
    };
    Object.defineProperty(CachedSubscribedData.prototype, "tuples", {
        get: function () {
            return this._tuples;
        },
        set: function (tuples) {
            this.touch();
            this._tuples = tuples;
        },
        enumerable: true,
        configurable: true
    });
    CachedSubscribedData.prototype.touch = function () {
        this._lastTouched = Date.now();
    };
    CachedSubscribedData.prototype.isReadyForFlush = function () {
        return this._lastTouched != null
            && (this._lastTouched + this.FLUSH_WAIT) <= Date.now();
    };
    CachedSubscribedData.prototype.flush = function () {
        this.lastServerAskDate = null;
        this.lastServerPayloadDate = null;
        this._tuples = null;
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
            .pipe(operators_1.takeUntil(_this.onDestroyEvent), operators_1.filter(function (online) { return online === true; }))
            .subscribe(function (online) { return _this.vortexOnlineChanged(); });
        // Cleanup dead subscribers every 30 seconds.
        var cleanupTimer = setInterval(function () { return _this.cleanupDeadCaches(); }, 2000);
        _this.onDestroyEvent.subscribe(function () { return clearInterval(cleanupTimer); });
        return _this;
    }
    TupleDataOfflineObserverService.prototype._nameService = function () {
        return this.tupleDataObservableName;
    };
    TupleDataOfflineObserverService.prototype.pollForTuples = function (tupleSelector, useCache) {
        var _this = this;
        if (useCache === void 0) { useCache = true; }
        // --- If the data exists in the cache, then return it
        var tsStr = tupleSelector.toOrderedJsonStr();
        if (useCache && this.cacheByTupleSelector.hasOwnProperty(tsStr)) {
            var cachedData = this.cacheByTupleSelector[tsStr];
            cachedData.resetTearDown();
            if (cachedData.cacheEnabled && cachedData.lastServerPayloadDate != null) {
                return Promise.resolve(cachedData.tuples);
            }
        }
        // --- Else, we want the data from the server
        // The PayloadEndpoint for this observable should also pickup and process
        // the response. So that will take care of the cache update and notify of
        // subscribers.
        var startFilt = UtilMisc_1.extend({ "subscribe": false, useCache: useCache }, this.filt, {
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
    /** Flush Cache
     *
     * The Data Offine Observer can be used to offline cache data by observing a large
     * amounts of data, more data then the user would normally look at.
     *
     * If it's being used like this then the cache should be flushed during the process
     * to ensure it's not all being kept in memory.
     *
     * @param {TupleSelector} tupleSelector The tuple selector to flush the cache for
     */
    TupleDataOfflineObserverService.prototype.flushCache = function (tupleSelector) {
        var tsStr = tupleSelector.toOrderedJsonStr();
        if (this.cacheByTupleSelector.hasOwnProperty(tsStr)) {
            var cachedData = this.cacheByTupleSelector[tsStr];
            cachedData.flush();
        }
        this.cleanupDeadCaches();
    };
    /** Subscribe to Tuple Selector
     *
     * Get an observable that will be fired when any new data updates are available
     * Data is loaded from the local db cache, while it waits for the server to respond.
     * * either from the server, or if they are locally updated with updateOfflineState()
     *
     * @param {TupleSelector} tupleSelector
     * @param {boolean} disableCache
     * @param {boolean} disableStorage
     * @param {boolean} disableAskServer, Use this to store and observe data completely
     *      within the angular app.
     * @returns {Subject<Tuple[]>}
     */
    TupleDataOfflineObserverService.prototype.subscribeToTupleSelector = function (tupleSelector, disableCache, disableStorage, disableAskServer) {
        var _this = this;
        if (disableCache === void 0) { disableCache = false; }
        if (disableStorage === void 0) { disableStorage = false; }
        if (disableAskServer === void 0) { disableAskServer = false; }
        var tsStr = tupleSelector.toOrderedJsonStr();
        var cachedData = null;
        // If the cache exists, use it
        if (this.cacheByTupleSelector.hasOwnProperty(tsStr)) {
            cachedData = this.cacheByTupleSelector[tsStr];
            cachedData.cacheEnabled = cachedData.cacheEnabled && !disableCache;
            cachedData.storageEnabled = cachedData.storageEnabled && !disableStorage;
            cachedData.askServerEnabled = cachedData.askServerEnabled && !disableAskServer;
            // If the cache is enabled, and we have tuple data, then notify
            if (cachedData.cacheEnabled && cachedData.tuples != null) {
                // Emit after we return, to ensure the subscribe happens first
                setTimeout(function () {
                    _this.notifyObservers(cachedData, tupleSelector, cachedData.tuples);
                }, 0);
                return cachedData.subject;
            }
            // ELSE, Create the cache
        }
        else {
            cachedData = new CachedSubscribedData(tupleSelector);
            cachedData.cacheEnabled = !disableCache;
            cachedData.storageEnabled = !disableStorage;
            cachedData.askServerEnabled = !disableAskServer;
            this.cacheByTupleSelector[tsStr] = cachedData;
        }
        // If asking the server is enabled and we have not asked the server, then ask
        if (cachedData.askServerEnabled && cachedData.lastServerAskDate == null) {
            this.tellServerWeWantData([tupleSelector], disableCache);
        }
        // If the tuples are null (because it's new or been flushed),
        // Then ask the local DB again for it.
        if (cachedData.storageEnabled && cachedData.tuples == null) {
            this.tupleOfflineStorageService
                .loadTuplesEncoded(tupleSelector)
                .then(function (vortexMsgOrNull) {
                // There is no data, return
                if (vortexMsgOrNull == null)
                    return;
                return Payload_1.Payload.fromEncodedPayload(vortexMsgOrNull)
                    .then(function (payload) {
                    // If the server has responded before we loaded the data, then just
                    // ignore the cached data.
                    if (cachedData.lastServerPayloadDate != null)
                        return;
                    // Update the tuples, and notify if them
                    cachedData.tuples = payload.tuples;
                    _this.notifyObservers(cachedData, tupleSelector, payload.tuples);
                });
            })
                .catch(function (err) {
                _this.vortexStatusService.logError("loadTuples failed : " + err);
                throw new Error(err);
            });
        }
        cachedData.resetTearDown();
        return cachedData.subject;
    };
    /** Update Offline State
     *
     * This method updates the offline stored data, which will be used until the next
     * update from the server comes along.
     * @param tupleSelector: The tuple selector to update tuples for
     * @param tuples: The new data to store
     */
    TupleDataOfflineObserverService.prototype.updateOfflineState = function (tupleSelector, tuples) {
        var _this = this;
        // AND store the data locally
        return this.storeDataLocally(tupleSelector, tuples)
            .then(function () {
            var tsStr = tupleSelector.toOrderedJsonStr();
            if (!_this.cacheByTupleSelector.hasOwnProperty(tsStr))
                return;
            var cachedData = _this.cacheByTupleSelector[tsStr];
            cachedData.tuples = tuples;
            _this.notifyObservers(cachedData, tupleSelector, tuples);
        });
    };
    TupleDataOfflineObserverService.prototype.cleanupDeadCaches = function () {
        for (var _i = 0, _a = UtilMisc_1.dictKeysFromObject(this.cacheByTupleSelector); _i < _a.length; _i++) {
            var key = _a[_i];
            var cachedData = this.cacheByTupleSelector[key];
            // If no activity has occured on the cache, then flush it
            if (cachedData.isReadyForFlush()) {
                console.log("Flushing cache due to expiry " + key);
                cachedData.flush();
            }
            // Tear down happens 30s after the last subscriber unsubscribes
            // If there are subscribers, then reset the teardown clock
            if (cachedData.subject.observers.length != 0) {
                cachedData.resetTearDown();
                // Tear down the cahce, including telling the server we're no longer
                // observing the data
            }
            else if (cachedData.isReadyForTearDown()) {
                console.log("Tearing down cache " + key);
                cachedData.flush();
                delete this.cacheByTupleSelector[key];
                this.tellServerWeWantData([cachedData.tupleSelector], null, true);
                // if there are no subscribers, then mark it for tear down (30s time)
            }
            else {
                cachedData.markForTearDown();
            }
        }
    };
    TupleDataOfflineObserverService.prototype.vortexOnlineChanged = function () {
        this.cleanupDeadCaches();
        var tupleSelectors = [];
        for (var _i = 0, _a = UtilMisc_1.dictKeysFromObject(this.cacheByTupleSelector); _i < _a.length; _i++) {
            var key = _a[_i];
            var cache = this.cacheByTupleSelector[key];
            if (cache.askServerEnabled)
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
        this.notifyObserversAndStore(cachedData, tupleSelector, payload.tuples, encodedPayload);
    };
    TupleDataOfflineObserverService.prototype.tellServerWeWantData = function (tupleSelectors, disableCache, unsubscribe) {
        if (disableCache === void 0) { disableCache = false; }
        if (unsubscribe === void 0) { unsubscribe = false; }
        if (!this.vortexStatusService.snapshot.isOnline)
            return;
        var startFilt = UtilMisc_1.extend({ "subscribe": true }, this.filt);
        var payloads = [];
        for (var _i = 0, tupleSelectors_1 = tupleSelectors; _i < tupleSelectors_1.length; _i++) {
            var tupleSelector = tupleSelectors_1[_i];
            var tsStr = tupleSelector.toOrderedJsonStr();
            if (this.cacheByTupleSelector.hasOwnProperty(tsStr))
                this.cacheByTupleSelector[tsStr].lastServerAskDate = moment();
            var filt = UtilMisc_1.extend({}, startFilt, {
                "tupleSelector": tupleSelector,
                "unsubscribe": unsubscribe
            });
            if (disableCache != null)
                filt["disableCache"] = disableCache;
            payloads.push(new Payload_1.Payload(filt));
        }
        this.vortexService.sendPayload(payloads);
    };
    TupleDataOfflineObserverService.prototype.notifyObservers = function (cachedData, tupleSelector, tuples) {
        // Notify Observers
        try {
            cachedData.subject.next(tuples);
        }
        catch (e) {
            // NOTE: Observables automatically remove observers when the raise exceptions.
            console.log("ERROR: TupleDataObserverService.notifyObservers, observable has been removed\n            " + e.toString() + "\n            " + tupleSelector.toOrderedJsonStr());
        }
    };
    TupleDataOfflineObserverService.prototype.notifyObserversAndStore = function (cachedData, tupleSelector, tuples, encodedPayload) {
        if (encodedPayload === void 0) { encodedPayload = null; }
        this.notifyObservers(cachedData, tupleSelector, tuples);
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
        return this.tupleOfflineStorageService.saveTuplesEncoded(tupleSelector, encodedPayload)
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