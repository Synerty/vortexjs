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
var pako = require("pako");
var base64 = require("base-64");
function btoa(data) {
    try {
        return window["btoa"](data);
    }
    catch (e) {
        return base64.encode(data);
    }
}
function atob(data) {
    try {
        return window["atob"](data);
    }
    catch (e) {
        return base64.decode(data);
    }
}
var PayloadDelegateABC_1 = require("./PayloadDelegateABC");
var PayloadDelegateInMain = /** @class */ (function (_super) {
    __extends(PayloadDelegateInMain, _super);
    function PayloadDelegateInMain() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PayloadDelegateInMain.prototype.deflateAndEncode = function (payloadJson) {
        return new Promise(function (resolve, reject) {
            var compressedData = pako.deflate(payloadJson, { to: "string" });
            var encodedData = btoa(compressedData);
            resolve(encodedData);
        });
    };
    PayloadDelegateInMain.prototype.decodeAndInflate = function (vortexStr) {
        return new Promise(function (resolve, reject) {
            var compressedData = atob(vortexStr);
            var payloadJson = pako.inflate(compressedData, { to: "string" });
            resolve(payloadJson);
        });
    };
    return PayloadDelegateInMain;
}(PayloadDelegateABC_1.PayloadDelegateABC));
exports.PayloadDelegateInMain = PayloadDelegateInMain;
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/payload/PayloadDelegateInMain.js.map