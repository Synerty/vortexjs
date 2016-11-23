"use strict";
var PayloadIO_1 = require("./PayloadIO");
var _1_Util_1 = require("../js_util/1_Util");
var PayloadEndpoint = (function () {
    function PayloadEndpoint(filter, processFunction, angularScope, processLatestOnly) {
        if (processLatestOnly === void 0) { processLatestOnly = false; }
        this.process = function (payload) {
            var self = this;
            for (var key in self._filt) {
                if (!self._filt.hasOwnProperty(key))
                    continue;
                if (payload.filt[key] !== self._filt[key])
                    return;
            }
            if (self._processLatestOnly) {
                if (self._lastPayloadDate == null || self._lastPayloadDate < payload.date)
                    self._lastPayloadDate = payload.date;
                else
                    return;
            }
            return self._processFunction(payload);
        };
        this.shutdown = function () {
            var self = this;
            PayloadIO_1.default.remove(self);
        };
        var self = this;
        self._filt = filter;
        self._lastPayloadDate = null;
        self._processLatestOnly = processLatestOnly === true;
        if (self._filt.key == null) {
            throw new Error("There is no 'key' in the payload filt"
                + ", There must be one for routing");
        }
        _1_Util_1.assert(self._filt != null, "Payload filter is null");
        if (typeof filter === "string") {
            self
                .
                    _filt = { key: filter };
        }
        // TODO, Implement Weak rfs
        self._processFunction = processFunction;
        PayloadIO_1.default.add(self);
        // Add auto tear downs for angular scopes
        if (angularScope !== undefined) {
            angularScope.$on("$destroy", function () {
                self.shutdown();
            });
        }
    }
    return PayloadEndpoint;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PayloadEndpoint;
