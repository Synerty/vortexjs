"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var pako = require("pako");
var base64 = require("base-64");
var PayloadDelegateABC_1 = require("./PayloadDelegateABC");
function btoa(data) {
    return base64.encode(data);
}
function atob(data) {
    return base64.decode(data);
}
var PayloadDelegateInMainNs = /** @class */ (function (_super) {
    __extends(PayloadDelegateInMainNs, _super);
    function PayloadDelegateInMainNs() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PayloadDelegateInMainNs.prototype.deflateAndEncode = function (payloadJson) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                var compressedData = pako.deflate(payloadJson, { to: "string" });
                setTimeout(function () {
                    var encodedData = btoa(compressedData);
                    resolve(encodedData);
                }, 0);
            }, 0);
        });
    };
    PayloadDelegateInMainNs.prototype.encodeEnvelope = function (payloadJson) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                var encodedData = btoa(payloadJson);
                resolve(encodedData);
            }, 0);
        });
    };
    PayloadDelegateInMainNs.prototype.decodeAndInflate = function (vortexStr) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                var compressedData = atob(vortexStr);
                setTimeout(function () {
                    var payloadJson = pako.inflate(compressedData, { to: "string" });
                    resolve(payloadJson);
                }, 0);
            }, 0);
        });
    };
    PayloadDelegateInMainNs.prototype.decodeEnvelope = function (vortexStr) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                var payloadJson = atob(vortexStr);
                resolve(payloadJson);
            }, 0);
        });
    };
    return PayloadDelegateInMainNs;
}(PayloadDelegateABC_1.PayloadDelegateABC));
exports.PayloadDelegateInMainNs = PayloadDelegateInMainNs;
//# sourceMappingURL=PayloadDelegateInMainNs.js.map