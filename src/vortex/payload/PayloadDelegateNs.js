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
        var worker;
        if (global.TNS_WEBPACK) {
            var Worker_1 = require("nativescript-worker-loader!../PayloadDelegateNsEncodeWorker.js");
            worker = new Worker_1();
        }
        else {
            worker = new Worker("./PayloadDelegateNsEncodeWorker.js");
        }
        return new Promise(function (resolve, reject) {
            function callError(error) {
                reject(error);
                console.log("ERROR: PayloadDelegateNs.deflateAndEncode " + error);
            }
            worker.onmessage = function (result) {
                var resultAny = result.data;
                var error = resultAny["error"];
                if (error == null) {
                    resolve(resultAny["encodedData"]);
                }
                else {
                    callError(error);
                }
                worker.terminate();
            };
            worker.onerror = function (error) {
                callError(error);
                worker.terminate();
            };
            worker.postMessage({ payloadJson: payloadJson });
        });
    };
    PayloadDelegateNs.prototype.decodeAndInflate = function (vortexStr) {
        var worker;
        if (global.TNS_WEBPACK) {
            var Worker_2 = require("nativescript-worker-loader!./PayloadDelegateNsDecodeWorker.js");
            worker = new Worker_2();
        }
        else {
            worker = new Worker('./PayloadDelegateNsDecodeWorker.js');
        }
        return new Promise(function (resolve, reject) {
            function callError(error) {
                reject(error);
                console.log("ERROR: PayloadDelegateNs.decodeAndInflate " + error);
            }
            worker.onmessage = function (result) {
                var resultAny = result.data;
                var error = resultAny["error"];
                if (error == null) {
                    resolve(resultAny["payloadJson"]);
                }
                else {
                    callError(error);
                }
                worker.terminate();
            };
            worker.onerror = function (error) {
                callError(error);
                worker.terminate();
            };
            worker.postMessage({ vortexStr: vortexStr });
        });
    };
    return PayloadDelegateNs;
}(PayloadDelegateABC_1.PayloadDelegateABC));
exports.PayloadDelegateNs = PayloadDelegateNs;
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/payload/PayloadDelegateNs.js.map