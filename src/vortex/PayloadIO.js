"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STOP_PROCESSING = "STOP_PROCESSING";
var PayloadIO = /** @class */ (function () {
    function PayloadIO() {
        var self = this;
        self._endpoints = [];
    }
    PayloadIO.prototype.add = function (endpoint) {
        var self = this;
        self._endpoints.add(endpoint);
    };
    PayloadIO.prototype.remove = function (endpoint) {
        var self = this;
        self._endpoints.remove(endpoint);
    };
    PayloadIO.prototype.process = function (payloadEnvelope) {
        var self = this;
        // Make a copy of the endpoints array, it may change endpoints
        // can remove them selves during iteration.
        var endpoints = self._endpoints.slice(0);
        for (var i = 0; i < endpoints.length; ++i) {
            if (endpoints[i].process(payloadEnvelope) === exports.STOP_PROCESSING)
                break;
        }
    };
    return PayloadIO;
}());
exports.PayloadIO = PayloadIO;
exports.payloadIO = new PayloadIO();
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/PayloadIO.js.map