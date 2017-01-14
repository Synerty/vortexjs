"use strict";
var rxjs_1 = require("rxjs");
var Payload_1 = require("./Payload");
var PayloadEndpoint_1 = require("./PayloadEndpoint");
var core_1 = require("@angular/core");
var VortexClientABC_1 = require("./VortexClientABC");
var PayloadFilterKeys_1 = require("./PayloadFilterKeys");
var UtilMisc_1 = require("./UtilMisc");
// ------------------
// Some private structures
var TupleLoaderEventEnum;
(function (TupleLoaderEventEnum) {
    TupleLoaderEventEnum[TupleLoaderEventEnum["Load"] = 0] = "Load";
    TupleLoaderEventEnum[TupleLoaderEventEnum["Save"] = 1] = "Save";
    TupleLoaderEventEnum[TupleLoaderEventEnum["Delete"] = 2] = "Delete";
})(TupleLoaderEventEnum || (TupleLoaderEventEnum = {}));
/**
 * TupleLoader for Angular2 + Synerty Vortex
 *
 * @param: vortex The vortex instance to send via.
 *
 * @param: component The component to register our events on.
 *
 * @param: filterUpdateCallable A IFilterUpdateCallable callable that returns null
 * or an IPayloadFilter
 *
 * @param: balloonMsg The Ng2BalloonMsgService
 *
 * Manual changes can be triggerd as follows.
 * * "load()"
 * * "save()"
 * * "del()"
 */
var TupleLoader = (function () {
    function TupleLoader(vortex, component, zone, filterUpdateCallable, balloonMsg) {
        if (balloonMsg === void 0) { balloonMsg = null; }
        var _this = this;
        this.vortex = vortex;
        this.component = component;
        this.zone = zone;
        this.balloonMsg = balloonMsg;
        this.lastPayloadFilt = null;
        this.lastTuples = null;
        this.timer = null;
        this.lastPromise = null;
        this.event = new core_1.EventEmitter();
        this.endpoint = null;
        if (filterUpdateCallable instanceof Function) {
            this.filterUpdateCallable = filterUpdateCallable;
        }
        else {
            this.filterUpdateCallable = (function () {
                return filterUpdateCallable;
            });
        }
        // Regiseter for the angular docheck
        var doCheckSub = this.component.doCheckEvent
            .subscribe(function () { return _this.filterChangeCheck(); });
        // Create the observable object
        this._observable = rxjs_1.Observable.create(function (observer) { return _this.observer = observer; });
        // Call subscribe, otherwise the observer is never created, and we can never call
        // next() on it.
        this._observable.subscribe().unsubscribe();
        // Remove all observers when the component is destroyed.
        var onDestroySub = this.component.onDestroyEvent.subscribe(function () {
            if (_this._observable['observers'] != null) {
                for (var _i = 0, _a = _this._observable['observers']; _i < _a.length; _i++) {
                    var observer = _a[_i];
                    observer.unsubscribe();
                }
            }
            doCheckSub.unsubscribe();
            onDestroySub.unsubscribe();
        });
    }
    Object.defineProperty(TupleLoader.prototype, "observable", {
        /**
         * @property: The tuple observable to subscribe to.
         */
        get: function () {
            return this._observable;
        },
        enumerable: true,
        configurable: true
    });
    TupleLoader.prototype.filterChangeCheck = function () {
        var _this = this;
        // Create a copy
        var newFilter = UtilMisc_1.extend({}, this.filterUpdateCallable());
        if (newFilter == null) {
            if (this.endpoint != null) {
                this.endpoint.shutdown();
                this.endpoint = null;
            }
            this.lastTuples = null;
            this.lastPayloadFilt = null;
            return;
        }
        if (this.lastPayloadFilt != null &&
            UtilMisc_1.deepEqual(newFilter, this.lastPayloadFilt, { strict: true })) {
            return;
        }
        this.lastPayloadFilt = newFilter;
        this.endpoint = new PayloadEndpoint_1.PayloadEndpoint(this.component, this.lastPayloadFilt, true);
        this.endpoint.observable.subscribe(function (payload) { return _this.processPayload(payload); });
        this.vortex.send(new Payload_1.Payload(this.lastPayloadFilt));
    };
    /**
     * Load Loads the data from a server
     *
     * @returns: Promise<Payload>, which is called when the load succeeds or fails.
     *
     */
    TupleLoader.prototype.load = function () {
        return this.saveOrLoad(TupleLoaderEventEnum.Load);
    };
    /**
     * Save
     *
     * Collects the data from the form, into the tuple and sends it through the
     * vortex.
     *
     * @param: tuples The tuples to save, if tuples is null, the last loaded tuples will
     * be used.
     *
     * @returns: Promise, which is called when the save succeeds or fails.
     *
     */
    TupleLoader.prototype.save = function (tuples) {
        if (tuples === void 0) { tuples = null; }
        return this.saveOrLoad(TupleLoaderEventEnum.Save, tuples);
    };
    TupleLoader.prototype.saveOrLoad = function (type, tuples) {
        var _this = this;
        if (tuples === void 0) { tuples = null; }
        // I'm not sure if the promise is set straight away, so at least null out
        // the last one.
        this.lastPromise = null;
        // Initialise the promise
        var promise = new Promise(function (resolve, reject) {
            return _this.lastPromise = {
                type: type,
                resolve: resolve,
                reject: reject
            };
        });
        // Check if there is already a load or save in progress
        if (this.setupTimer() !== true) {
            setTimeout(function () {
                _this.lastPromise.reject("Another save or load is still in progress.");
                _this.lastPromise = null;
            }, 0);
            return promise;
        }
        if (type === TupleLoaderEventEnum.Load) {
            // Force a filter update and reload
            this.lastPayloadFilt = null;
            this.filterChangeCheck();
            // If there was no filter update, fail
            if (this.lastPayloadFilt == null) {
                setTimeout(function () {
                    _this.lastPromise.reject("There is no payload filter provided, load failed");
                    _this.lastPromise = null;
                }, 0);
                return promise;
            }
        }
        else if (type === TupleLoaderEventEnum.Save
            || type === TupleLoaderEventEnum.Delete) {
            if (tuples != null)
                this.lastTuples = tuples;
            // Check if we have tuples to save.
            if (this.lastTuples == null) {
                setTimeout(function () {
                    _this.lastPromise.reject("No tuples to save. " +
                        " Provide one to with the save(tuples) call or load some first " +
                        " with the filterUpdateCallable");
                    _this.lastPromise = null;
                }, 0);
                return promise;
            }
            // Save the tuples
            this.vortex.send(new Payload_1.Payload(this.lastPayloadFilt, this.lastTuples));
        }
        else {
            throw new Error("Type " + type + " is not implemented.");
        }
        // Return the promise
        return promise;
    };
    /**
     * Delete
     *
     * Sends the tuples to the server for it to delete them.
     *
     * @returns :Promise, which is called when the save succeeds or fails.
     *
     */
    TupleLoader.prototype.del = function (tuples) {
        if (tuples === void 0) { tuples = null; }
        // Set the delete key. The server will delete objects with this set.
        this.lastPayloadFilt[PayloadFilterKeys_1.plDeleteKey] = true;
        var promise = this.saveOrLoad(TupleLoaderEventEnum.Delete, tuples);
        // Remove the delete key
        delete this.lastPayloadFilt[PayloadFilterKeys_1.plDeleteKey];
        return promise;
    };
    TupleLoader.prototype.processPayload = function (payload) {
        var _this = this;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        // No result, means this was a load
        if (payload.result == null) {
            try {
                this.event.emit(TupleLoaderEventEnum.Load);
            }
            catch (e) {
                console.log("TupleLoader - Load event emit error");
                console.error(e);
            }
        }
        else if (payload.result === true) {
            try {
                if (payload.filt.hasOwnProperty(PayloadFilterKeys_1.plDeleteKey)) {
                    this.event.emit(TupleLoaderEventEnum.Delete);
                }
                else {
                    this.event.emit(TupleLoaderEventEnum.Save);
                }
            }
            catch (e) {
                console.log("TupleLoader - Save/Delete event emit error");
                console.error(e);
            }
        }
        else {
            if (this.lastPromise) {
                this.lastPromise.reject(payload.result.toString());
                this.lastPromise = null;
            }
            this.balloonMsg && this.balloonMsg.showError(payload.result.toString());
            return;
        }
        if (this.lastPromise) {
            this.lastPromise.resolve(payload);
            this.lastPromise = null;
        }
        this.lastTuples = payload.tuples;
        this.zone.run(function () { return _this.observer.next(payload.tuples); });
    };
    TupleLoader.prototype.resetTimer = function () {
        this.operationTimeout(false);
    };
    TupleLoader.prototype.setupTimer = function () {
        var self = this;
        if (self.timer != null) {
            this.balloonMsg && this.balloonMsg.showWarning("We're already processing a request, Action failed");
            return false;
        }
        self.timer = setTimeout(UtilMisc_1.bind(self, self.operationTimeout), VortexClientABC_1.SERVER_RESPONSE_TIMEOUT);
        return true;
    };
    TupleLoader.prototype.operationTimeout = function (showBaloon) {
        if (showBaloon === void 0) { showBaloon = true; }
        this.timer = null;
        var msg = "The server failed to respond, operaton timed out";
        if (this.lastPromise) {
            msg = this.lastPromise.type + " Failed, Response Timed out";
            this.lastPromise.reject(msg);
            this.lastPromise = null;
        }
        showBaloon && this.balloonMsg && this.balloonMsg.showError(msg);
    };
    return TupleLoader;
}());
exports.TupleLoader = TupleLoader;
//# sourceMappingURL=/home/peek/project/vortexjs/src/src/vortex/TupleLoader.js.map