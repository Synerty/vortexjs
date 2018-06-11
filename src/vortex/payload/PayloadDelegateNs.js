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
var PromiseWorker = require("promise-worker");
var PayloadDelegateNs = /** @class */ (function (_super) {
    __extends(PayloadDelegateNs, _super);
    function PayloadDelegateNs() {
        var _this = _super.call(this) || this;
        _this.inMainDelegate = new PayloadDelegateInMain_1.PayloadDelegateInMain();
        if (global.TNS_WEBPACK) {
            var Worker_1 = require("nativescript-worker-loader!./PayloadDelegateNsEncodeWorker.js");
            _this.encodeWorker = new Worker_1();
        }
        else {
            _this.encodeWorker = new Worker("./PayloadDelegateNsEncodeWorker.js");
        }
        // Make this compatible with promise-worker
        _this.encodeWorker.addEventListener = function (listener) {
            _this.encodeWorker.onmessage = listener;
        };
        _this.encodePromiseWorker = new PromiseWorker(_this.encodeWorker);
        if (global.TNS_WEBPACK) {
            var Worker_2 = require("nativescript-worker-loader!./PayloadDelegateNsDecodeWorker.js");
            _this.decodeWorker = new Worker_2();
        }
        else {
            _this.decodeWorker = new Worker("./PayloadDelegateNsDecodeWorker.js");
        }
        // Make this compatible with promise-worker
        _this.decodeWorker.addEventListener = function (listener) {
            _this.decodeWorker.onmessage = listener;
        };
        _this.decodePromiseWorker = new PromiseWorker(_this.decodeWorker);
        return _this;
    }
    // ------------------------------------------------------------------------
    PayloadDelegateNs.prototype.deflateAndEncode = function (payloadJson) {
        // Don't send small messages to the worker
        if (payloadJson.length < (10 * 1024))
            return this.inMainDelegate.deflateAndEncode(payloadJson);
        return this.encodePromiseWorker.postMessage(payloadJson);
    };
    // ------------------------------------------------------------------------
    PayloadDelegateNs.prototype.encodeEnvelope = function (payloadJson) {
        return this.inMainDelegate.encodeEnvelope(payloadJson);
    };
    // ------------------------------------------------------------------------
    PayloadDelegateNs.prototype.decodeAndInflate = function (vortexStr) {
        // Don't send small messages to the worker
        if (vortexStr.length < (5 * 1024))
            return this.inMainDelegate.decodeAndInflate(vortexStr);
        return this.decodePromiseWorker.postMessage(vortexStr);
    };
    // ------------------------------------------------------------------------
    PayloadDelegateNs.prototype.decodeEnvelope = function (vortexStr) {
        return this.inMainDelegate.decodeEnvelope(vortexStr);
    };
    return PayloadDelegateNs;
}(PayloadDelegateABC_1.PayloadDelegateABC));
exports.PayloadDelegateNs = PayloadDelegateNs;
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/payload/PayloadDelegateNs.js.map