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
var PayloadDelegateWeb = /** @class */ (function (_super) {
    __extends(PayloadDelegateWeb, _super);
    function PayloadDelegateWeb() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.inMainDelegate = new PayloadDelegateInMain_1.PayloadDelegateInMain();
        return _this;
    }
    PayloadDelegateWeb.prototype.deflateAndEncode = function (payloadJson) {
        // Don't send small messages to the worker
        if (payloadJson.length < (10 * 1024))
            return this.inMainDelegate.deflateAndEncode(payloadJson);
        var worker = new Worker('./PayloadDelegateWebEncodeWorker.js');
        return new Promise(function (resolve, reject) {
            function callError(error) {
                reject(error);
                console.log("ERROR: PayloadDelegateWeb.deflateAndEncode " + error);
            }
            worker.addEventListener('message', function (result) {
                var resultAny = result["data"];
                var error = resultAny.error;
                if (error == null) {
                    resolve(resultAny["encodedData"]);
                }
                else {
                    callError(error);
                }
                worker.terminate();
            }, false);
            worker.addEventListener('error', function (error) {
                callError(error);
                worker.terminate();
            }, false);
            worker.postMessage({ payloadJson: payloadJson });
        });
    };
    // ------------------------------------------------------------------------
    PayloadDelegateWeb.prototype.encodeEnvelope = function (payloadJson) {
        return this.inMainDelegate.encodeEnvelope(payloadJson);
    };
    PayloadDelegateWeb.prototype.decodeAndInflate = function (vortexStr) {
        // Don't send small messages to the worker
        if (vortexStr.length < (5 * 1024))
            return this.inMainDelegate.decodeAndInflate(vortexStr);
        var worker = new Worker('./PayloadDelegateWebDecodeWorker.js');
        return new Promise(function (resolve, reject) {
            function callError(error) {
                reject(error);
                console.log("ERROR: PayloadDelegateWeb.decodeAndInflate " + error);
            }
            worker.addEventListener('message', function (result) {
                var resultAny = result["data"];
                var error = resultAny.error;
                if (error == null) {
                    resolve(resultAny["payloadJson"]);
                }
                else {
                    callError(error);
                }
                worker.terminate();
            }, false);
            worker.addEventListener('error', function (error) {
                callError(error);
                worker.terminate();
            }, false);
            worker.postMessage({ vortexStr: vortexStr });
        });
    };
    // ------------------------------------------------------------------------
    PayloadDelegateWeb.prototype.decodeEnvelope = function (vortexStr) {
        return this.inMainDelegate.decodeEnvelope(vortexStr);
    };
    return PayloadDelegateWeb;
}(PayloadDelegateABC_1.PayloadDelegateABC));
exports.PayloadDelegateWeb = PayloadDelegateWeb;
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/payload/PayloadDelegateWeb.js.map