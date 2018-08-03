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
Object.defineProperty(exports, "__esModule", { value: true });
var PayloadDelegateABC_1 = require("./PayloadDelegateABC");
var PayloadDelegateNs = /** @class */ (function (_super) {
    __extends(PayloadDelegateNs, _super);
    function PayloadDelegateNs() {
        var _this = _super.call(this) || this;
        // --------------------------------------------------------------------
        if (global.TNS_WEBPACK) {
            var Worker_1 = require("nativescript-worker-loader!./PayloadDelegateNsEncodeWorker.js");
            _this.encodeWorker = new Worker_1();
        }
        else {
            _this.encodeWorker = new Worker("./PayloadDelegateNsEncodeWorker.js");
        }
        _this.encodeWorker.onmessage = PayloadDelegateNs.onMessage;
        _this.encodeWorker.onerror = PayloadDelegateNs.onError;
        // --------------------------------------------------------------------
        if (global.TNS_WEBPACK) {
            var Worker_2 = require("nativescript-worker-loader!./PayloadDelegateNsDecodeWorker.js");
            _this.decodeWorker = new Worker_2();
        }
        else {
            _this.decodeWorker = new Worker("./PayloadDelegateNsDecodeWorker.js");
        }
        _this.decodeWorker.onmessage = PayloadDelegateNs.onMessage;
        _this.decodeWorker.onerror = PayloadDelegateNs.onError;
        // --------------------------------------------------------------------
        if (global.TNS_WEBPACK) {
            var Worker_3 = require("nativescript-worker-loader!./PayloadEnvelopeDelegateNsEncodeWorker.js");
            _this.encodeEnvelopeWorker = new Worker_3();
        }
        else {
            _this.encodeEnvelopeWorker = new Worker("./PayloadEnvelopeDelegateNsEncodeWorker.js");
        }
        _this.encodeEnvelopeWorker.onmessage = PayloadDelegateNs.onMessage;
        _this.encodeEnvelopeWorker.onerror = PayloadDelegateNs.onError;
        // --------------------------------------------------------------------
        if (global.TNS_WEBPACK) {
            var Worker_4 = require("nativescript-worker-loader!./PayloadEnvelopeDelegateNsDecodeWorker.js");
            _this.decodeEnvelopeWorker = new Worker_4();
        }
        else {
            _this.decodeEnvelopeWorker = new Worker("./PayloadEnvelopeDelegateNsDecodeWorker.js");
        }
        _this.decodeEnvelopeWorker.onmessage = PayloadDelegateNs.onMessage;
        _this.decodeEnvelopeWorker.onerror = PayloadDelegateNs.onError;
        return _this;
    }
    // ------------------------------------------------------------------------
    PayloadDelegateNs.prototype.deflateAndEncode = function (payloadJson) {
        var _a = this.pushPromise(), callNumber = _a.callNumber, promise = _a.promise;
        this.encodeWorker.postMessage({
            callNumber: callNumber,
            payloadJson: payloadJson
        });
        return promise;
    };
    // ------------------------------------------------------------------------
    PayloadDelegateNs.prototype.encodeEnvelope = function (payloadJson) {
        var _a = this.pushPromise(), callNumber = _a.callNumber, promise = _a.promise;
        this.encodeEnvelopeWorker.postMessage({
            callNumber: callNumber,
            payloadJson: payloadJson
        });
        return promise;
    };
    // ------------------------------------------------------------------------
    PayloadDelegateNs.prototype.decodeAndInflate = function (vortexStr) {
        var _a = this.pushPromise(), callNumber = _a.callNumber, promise = _a.promise;
        this.decodeWorker.postMessage({
            callNumber: callNumber,
            vortexStr: vortexStr
        });
        return promise;
    };
    // ------------------------------------------------------------------------
    PayloadDelegateNs.prototype.decodeEnvelope = function (vortexStr) {
        var _a = this.pushPromise(), callNumber = _a.callNumber, promise = _a.promise;
        this.decodeEnvelopeWorker.postMessage({
            callNumber: callNumber,
            vortexStr: vortexStr
        });
        return promise;
    };
    PayloadDelegateNs.prototype.pushPromise = function () {
        var callNumber = PayloadDelegateNs._promisesNum++;
        // Roll it over
        if (PayloadDelegateNs._promisesNum > 10000)
            PayloadDelegateNs._promisesNum = 1;
        var promise = new Promise(function (resolve, reject) {
            PayloadDelegateNs._promises[callNumber] = {
                resolve: resolve,
                reject: reject
            };
        });
        return { callNumber: callNumber, promise: promise };
    };
    PayloadDelegateNs.popPromise = function (callNumber) {
        var promise = PayloadDelegateNs._promises[callNumber];
        delete PayloadDelegateNs._promises[callNumber];
        return promise;
    };
    PayloadDelegateNs.onMessage = function (postResult) {
        var resultAny = postResult.data;
        console.log("PayloadDelegateNS, Receiving : " + JSON.stringify(resultAny));
        var error = resultAny["error"];
        var callNumber = resultAny["callNumber"];
        var result = resultAny["result"];
        if (callNumber == null) {
            console.log("PayloadDelegateNs.onerror " + error);
            return;
        }
        var promise = PayloadDelegateNs.popPromise(callNumber);
        if (promise == null) {
            console.log("PayloadDelegateNs, Double worker callback " + error);
            return;
        }
        var resolve = promise["resolve"];
        var reject = promise["reject"];
        if (error == null) {
            setTimeout(function () { return resolve(result); }, 0);
        }
        else {
            reject(error);
        }
    };
    PayloadDelegateNs.onError = function (error) {
        console.log("PayloadDelegateNs.onerror " + error);
    };
    // ------------------------------------------------------------------------
    PayloadDelegateNs._promises = {};
    PayloadDelegateNs._promisesNum = 1;
    return PayloadDelegateNs;
}(PayloadDelegateABC_1.PayloadDelegateABC));
exports.PayloadDelegateNs = PayloadDelegateNs;
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/payload/PayloadDelegateNs.js.map