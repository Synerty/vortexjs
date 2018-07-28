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
var PayloadDelegateInMainWeb_1 = require("./PayloadDelegateInMainWeb");
var PromiseWorker = require("promise-worker");
var PayloadDelegateWeb = /** @class */ (function (_super) {
    __extends(PayloadDelegateWeb, _super);
    function PayloadDelegateWeb() {
        var _this = _super.call(this) || this;
        _this.inMainDelegate = new PayloadDelegateInMainWeb_1.PayloadDelegateInMainWeb();
        _this.encodeWorker = new Worker('./PayloadDelegateWebEncodeWorker.js');
        _this.encodePromiseWorker = new PromiseWorker(_this.encodeWorker);
        _this.decodeWorker = new Worker('./PayloadDelegateWebDecodeWorker.js');
        _this.decodePromiseWorker = new PromiseWorker(_this.decodeWorker);
        return _this;
    }
    PayloadDelegateWeb.prototype.deflateAndEncode = function (payloadJson) {
        // Don't send small messages to the worker
        if (payloadJson.length < (10 * 1024))
            return this.inMainDelegate.deflateAndEncode(payloadJson);
        return this.encodePromiseWorker.postMessage(payloadJson);
    };
    // ------------------------------------------------------------------------
    PayloadDelegateWeb.prototype.encodeEnvelope = function (payloadJson) {
        return this.inMainDelegate.encodeEnvelope(payloadJson);
    };
    PayloadDelegateWeb.prototype.decodeAndInflate = function (vortexStr) {
        // Don't send small messages to the worker
        if (vortexStr.length < (5 * 1024))
            return this.inMainDelegate.decodeAndInflate(vortexStr);
        return this.decodePromiseWorker.postMessage(vortexStr);
    };
    // ------------------------------------------------------------------------
    PayloadDelegateWeb.prototype.decodeEnvelope = function (vortexStr) {
        return this.inMainDelegate.decodeEnvelope(vortexStr);
    };
    return PayloadDelegateWeb;
}(PayloadDelegateABC_1.PayloadDelegateABC));
exports.PayloadDelegateWeb = PayloadDelegateWeb;
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/payload/PayloadDelegateWeb.js.map