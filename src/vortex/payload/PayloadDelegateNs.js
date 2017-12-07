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
var PayloadDelegateNs = (function (_super) {
    __extends(PayloadDelegateNs, _super);
    function PayloadDelegateNs() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PayloadDelegateNs.prototype.deflateAndEncode = function (payloadJson) {
        var worker = new Worker('./PayloadDelegateNsDecodeWorker.js');
        // var w;
        // if (global.TNS_WEBPACK) {
        //     var GrayscaleWorker = require("nativescript-worker-loader!./workers/grayscaler.js");
        //     w = new GrayscaleWorker();
        // } else {
        //     w = new Worker("./workers/grayscaler.js");
        // }
        return new Promise(function (resolve, reject) {
            worker.onmessage = function (result) {
                var resultAny = result;
                resolve(resultAny["payloadJson"]);
                worker.terminate();
            };
            worker.onerror = function (error) {
                reject(error);
                worker.terminate();
            };
            worker.postMessage({ payloadJson: payloadJson });
        });
    };
    PayloadDelegateNs.prototype.decodeAndInflate = function (vortexStr) {
        var worker = new Worker('./PayloadDelegateNsEncodeWorker.js');
        // var w;
        // if (global.TNS_WEBPACK) {
        //     var GrayscaleWorker = require("nativescript-worker-loader!./workers/grayscaler.js");
        //     w = new GrayscaleWorker();
        // } else {
        //     w = new Worker("./workers/grayscaler.js");
        // }
        return new Promise(function (resolve, reject) {
            worker.onmessage = function (result) {
                var resultAny = result;
                resolve(resultAny["encodedData"]);
                worker.terminate();
            };
            worker.onerror = function (error) {
                reject(error);
                worker.terminate();
            };
            worker.postMessage({ vortexStr: vortexStr });
        });
    };
    return PayloadDelegateNs;
}(PayloadDelegateABC_1.PayloadDelegateABC));
exports.PayloadDelegateNs = PayloadDelegateNs;
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/payload/PayloadDelegateNs.js.map