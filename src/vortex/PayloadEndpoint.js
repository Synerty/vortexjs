"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PayloadIO_1 = require("./PayloadIO");
var UtilMisc_1 = require("./UtilMisc");
require("./UtilArray");
var rxjs_1 = require("rxjs"); // Ensure it's included and defined
var PayloadEndpoint = (function () {
    function PayloadEndpoint(component, filter, processLatestOnly) {
        if (processLatestOnly === void 0) { processLatestOnly = false; }
        var _this = this;
        var self = this;
        self._filt = filter;
        self._lastPayloadDate = null;
        self._processLatestOnly = processLatestOnly === true;
        UtilMisc_1.assert(self._filt != null, 'Payload filter is null');
        if (self._filt.key == null) {
            var e = new Error("There is no 'key' in the payload filt                 , There must be one for routing - " + JSON.stringify(self._filt));
            console.log(e);
            throw e;
        }
        PayloadIO_1.payloadIO.add(self);
        // Add auto tear downs for angular scopes
        var subscription = component.onDestroyEvent.subscribe(function () {
            _this.shutdown();
            subscription.unsubscribe();
        });
        this._observable = new rxjs_1.Subject();
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
        if (!this.checkFilt(this._filt, payload.filt))
            return null;
        if (!this.checkDate(payload))
            return null;
        this._observable.next(payload);
        return null;
    };
    ;
    PayloadEndpoint.prototype.checkFilt = function (leftFilt, rightFilt) {
        for (var _i = 0, _a = UtilMisc_1.dictKeysFromObject(leftFilt, true); _i < _a.length; _i++) {
            var key = _a[_i];
            if (!rightFilt.hasOwnProperty(key))
                return false;
            var left = leftFilt[key];
            var right = rightFilt[key];
            if (typeof left !== typeof right)
                return false;
            // Handle special case for Arrays using our equals method in ArrayUtil
            if (left instanceof Array) {
                if (left.sort().equals(right.sort()))
                    continue;
                else
                    return false;
            }
            // Handle special case for Arrays using our equals method in ArrayUtil
            if (left instanceof Object) {
                if (this.checkFilt(left, right))
                    continue;
                else
                    return false;
            }
            if (left !== right)
                return false;
        }
        return true;
    };
    ;
    PayloadEndpoint.prototype.checkDate = function (payload) {
        if (this._processLatestOnly) {
            if (this._lastPayloadDate == null || this._lastPayloadDate < payload.date)
                this._lastPayloadDate = payload.date;
            else
                return false;
        }
        return true;
    };
    ;
    PayloadEndpoint.prototype.shutdown = function () {
        var self = this;
        PayloadIO_1.payloadIO.remove(self);
        if (this._observable['observers'] != null) {
            for (var _i = 0, _a = this._observable['observers']; _i < _a.length; _i++) {
                var observer = _a[_i];
                observer["unsubscribe"]();
            }
        }
    };
    ;
    return PayloadEndpoint;
}());
exports.PayloadEndpoint = PayloadEndpoint;
//# sourceMappingURL=/home/peek/project/vortexjs/src/vortex/PayloadEndpoint.js.map