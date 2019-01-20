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
var CALL_PAYLOAD_ENCODE = 1;
var CALL_PAYLOAD_DECODE = 2;
var CALL_PAYLOAD_ENVELOPE_ENCODE = 3;
var CALL_PAYLOAD_ENVELOPE_DECODE = 4;
var PayloadDelegateNs = /** @class */ (function (_super) {
    __extends(PayloadDelegateNs, _super);
    function PayloadDelegateNs() {
        var _this = _super.call(this) || this;
        _this.workers = [];
        _this.nextWorkerIndex = 0;
        for (var i = 0; i < PayloadDelegateNs.MAX_WORKERS; i++)
            _this.workers.push(_this.createWorker());
        return _this;
    }
    PayloadDelegateNs.prototype.nextWorker = function () {
        var worker = this.workers[this.nextWorkerIndex];
        if (PayloadDelegateNs.MAX_WORKERS == ++this.nextWorkerIndex)
            this.nextWorkerIndex = 0;
        return worker;
    };
    // noinspection JSMethodCanBeStatic
    PayloadDelegateNs.prototype.createWorker = function () {
        var worker;
        // --------------------------------------------------------------------
        if (global.TNS_WEBPACK) {
            var Worker_1 = require("nativescript-worker-loader!./PayloadDelegateNsWorker.js");
            worker = new Worker_1();
        }
        else {
            worker = new Worker("./PayloadDelegateNsWorker.js");
        }
        worker.onmessage = PayloadDelegateNs.onMessage;
        worker.onerror = PayloadDelegateNs.onError;
        return worker;
    };
    // ------------------------------------------------------------------------
    PayloadDelegateNs.prototype.deflateAndEncode = function (payloadJson) {
        var _a = this.pushPromise(), callNumber = _a.callNumber, promise = _a.promise;
        this.nextWorker().postMessage({
            call: CALL_PAYLOAD_ENCODE,
            callNumber: callNumber,
            payloadJson: payloadJson
        });
        return promise;
    };
    // ------------------------------------------------------------------------
    PayloadDelegateNs.prototype.decodeAndInflate = function (vortexStr) {
        var _a = this.pushPromise(), callNumber = _a.callNumber, promise = _a.promise;
        this.nextWorker().postMessage({
            call: CALL_PAYLOAD_DECODE,
            callNumber: callNumber,
            vortexStr: vortexStr
        });
        return promise;
    };
    // ------------------------------------------------------------------------
    PayloadDelegateNs.prototype.encodeEnvelope = function (payloadEnvelopeJson) {
        var _a = this.pushPromise(), callNumber = _a.callNumber, promise = _a.promise;
        this.nextWorker().postMessage({
            call: CALL_PAYLOAD_ENVELOPE_ENCODE,
            callNumber: callNumber,
            payloadEnvelopeJson: payloadEnvelopeJson
        });
        return promise;
    };
    // ------------------------------------------------------------------------
    PayloadDelegateNs.prototype.decodeEnvelope = function (vortexStr) {
        var _a = this.pushPromise(), callNumber = _a.callNumber, promise = _a.promise;
        this.nextWorker().postMessage({
            call: CALL_PAYLOAD_ENVELOPE_DECODE,
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
        // console.log(`PayloadDelegateNS, Receiving : ${JSON.stringify(resultAny)}`);
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
    PayloadDelegateNs.MAX_WORKERS = 8;
    // ------------------------------------------------------------------------
    PayloadDelegateNs._promises = {};
    PayloadDelegateNs._promisesNum = 1;
    return PayloadDelegateNs;
}(PayloadDelegateABC_1.PayloadDelegateABC));
exports.PayloadDelegateNs = PayloadDelegateNs;
//# sourceMappingURL=/Users/jchesney/dev-peek-util/vortexjs/src/vortex/payload/PayloadDelegateNs.js.map