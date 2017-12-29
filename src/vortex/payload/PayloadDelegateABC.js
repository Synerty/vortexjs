"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ----------------------------------------------------------------------------
// Typescript date - date fooler
function now() {
    return new Date();
}
exports.now = now;
function logLong(message, start, payload) {
    if (payload === void 0) { payload = null; }
    var duration = now() - start;
    var desc = '';
    // You get 5ms to do what you need before i call the performance cops.
    if (duration < 5)
        return;
    if (payload != null) {
        desc = ', ' + JSON.stringify(payload.filt);
    }
    console.log(message + ", took " + duration + desc);
}
exports.logLong = logLong;
// ----------------------------------------------------------------------------
var PayloadDelegateABC = (function () {
    function PayloadDelegateABC() {
    }
    return PayloadDelegateABC;
}());
exports.PayloadDelegateABC = PayloadDelegateABC;
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/payload/PayloadDelegateABC.js.map