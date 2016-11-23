"use strict";
var PayloadIO_1 = require("./PayloadIO");
var UtilMisc_1 = require("./UtilMisc");
require("./UtilArray");
var rxjs_1 = require("rxjs"); // Ensure it's included and defined
var PayloadEndpoint = (function () {
    function PayloadEndpoint(component, filter, processLatestOnly) {
        var _this = this;
        if (processLatestOnly === void 0) { processLatestOnly = false; }
        var self = this;
        self._filt = filter;
        self._lastPayloadDate = null;
        self._processLatestOnly = processLatestOnly === true;
        UtilMisc_1.assert(self._filt != null, "Payload filter is null");
        if (self._filt.key == null) {
            throw new Error("There is no 'key' in the payload filt"
                + ", There must be one for routing");
        }
        PayloadIO_1.payloadIO.add(self);
        // Add auto tear downs for angular scopes
        var subscription = component.onDestroyEvent.subscribe(function () {
            _this.shutdown();
            subscription.unsubscribe();
        });
        this._observable = rxjs_1.Observable.create(function (observer) { return _this._observer = observer; });
        // Call subscribe, otherwise the observer is never created, and we can never call
        // next() on it.
        this._observable.subscribe().unsubscribe();
    }
    Object.defineProperty(PayloadEndpoint.prototype, "observable", {
        get: function () {
            return this._observable;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Process Payload
     * Check if the payload is meant for us then process it.
     *
     * @return null, or if the function is overloaded, you could return STOP_PROCESSING
     * from PayloadIO, which will tell it to stop processing further endpoints.
     */
    PayloadEndpoint.prototype.process = function (payload) {
        if (!this.checkFilt(payload))
            return null;
        this._observer.next(payload);
        return null;
    };
    ;
    PayloadEndpoint.prototype.checkFilt = function (payload) {
        var self = this;
        for (var key in self._filt) {
            if (!self._filt.hasOwnProperty(key))
                continue;
            if (payload.filt[key] !== self._filt[key])
                return false;
        }
        if (self._processLatestOnly) {
            if (self._lastPayloadDate == null || self._lastPayloadDate < payload.date)
                self._lastPayloadDate = payload.date;
            else
                return false;
        }
        return true;
    };
    ;
    PayloadEndpoint.prototype.shutdown = function () {
        var self = this;
        PayloadIO_1.payloadIO.remove(self);
    };
    ;
    return PayloadEndpoint;
}());
exports.PayloadEndpoint = PayloadEndpoint;
