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
var PayloadDelegateInMain_1 = require("./PayloadDelegateInMain");
var PayloadDelegateNs = /** @class */ (function (_super) {
    __extends(PayloadDelegateNs, _super);
    function PayloadDelegateNs() {
        var _this = _super.call(this) || this;
        _this.inMainDelegate = new PayloadDelegateInMain_1.PayloadDelegateInMain();
        if (global.TNS_WEBPACK) {
            var Worker_1 = require("nativescript-worker-loader!../PayloadDelegateNsEncodeWorker.js");
            _this.encodeWorker = new Worker_1();
        }
        else {
            _this.encodeWorker = new Worker("./PayloadDelegateNsEncodeWorker.js");
        }
        _this.encodeWorker.onmessage = PayloadDelegateNs.onMessage;
        _this.encodeWorker.onerror = PayloadDelegateNs.onError;
        if (global.TNS_WEBPACK) {
            var Worker_2 = require("nativescript-worker-loader!../PayloadDelegateNsDecodeWorker.js");
            _this.decodeWorker = new Worker_2();
        }
        else {
            _this.decodeWorker = new Worker("./PayloadDelegateNsDecodeWorker.js");
        }
        _this.decodeWorker.onmessage = PayloadDelegateNs.onMessage;
        _this.decodeWorker.onerror = PayloadDelegateNs.onError;
        return _this;
    }
    PayloadDelegateNs.prototype.deflateAndEncode = function (payloadJson) {
        var _this = this;
        // Don't send small messages to the worker
        if (payloadJson.length < (10 * 1024))
            return this.inMainDelegate.deflateAndEncode(payloadJson);
        return new Promise(function (resolve, reject) {
            var callNumber = PayloadDelegateNs.pushPromise(resolve, reject);
            _this.encodeWorker.postMessage({
                callNumber: callNumber,
                payloadJson: payloadJson
            });
        });
    };
    PayloadDelegateNs.prototype.decodeAndInflate = function (vortexStr) {
        var _this = this;
        // Don't send small messages to the worker
        if (vortexStr.length < (5 * 1024))
            return this.inMainDelegate.decodeAndInflate(vortexStr);
        return new Promise(function (resolve, reject) {
            var callNumber = PayloadDelegateNs.pushPromise(resolve, reject);
            _this.decodeWorker.postMessage({
                callNumber: callNumber,
                vortexStr: vortexStr
            });
        });
    }; // ------------------------------------------------------------------------
    PayloadDelegateNs.popPromise = function (callNumber) {
        var promise = PayloadDelegateNs._promises[callNumber];
        delete PayloadDelegateNs._promises[callNumber];
        return promise;
    };
    PayloadDelegateNs.pushPromise = function (resolve, reject) {
        var callNumber = PayloadDelegateNs._promisesNum++;
        PayloadDelegateNs._promises[callNumber] = {
            resolve: resolve,
            reject: reject
        };
        return callNumber;
    };
    PayloadDelegateNs.onMessage = function (postResult) {
        var resultAny = postResult.data;
        // console.log(`WebSQL Service, Tx Receiving : ${JSON.stringify(resultAny)}`);
        var error = resultAny["error"];
        var callNumber = resultAny["callNumber"];
        var result = resultAny["result"];
        var promise = PayloadDelegateNs.popPromise(callNumber);
        var resolve = promise["resolve"];
        var reject = promise["reject"];
        if (error == null) {
            resolve(result);
        }
        else {
            reject(error);
        }
    };
    PayloadDelegateNs.onError = function (error) {
        console.log("PayloadDelegateNs.onerror " + error);
    };
    PayloadDelegateNs._promises = {};
    PayloadDelegateNs._promisesNum = 1;
    return PayloadDelegateNs;
}(PayloadDelegateABC_1.PayloadDelegateABC));
exports.PayloadDelegateNs = PayloadDelegateNs;
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/payload/PayloadDelegateNs.js.map