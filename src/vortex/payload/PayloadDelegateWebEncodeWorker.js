"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pako = require("pako");
var registerPromiseWorker = require("promise-worker/register");
registerPromiseWorker(function (payloadJson) {
    var compressedData = pako.deflate(payloadJson, { to: "string" });
    return btoa(compressedData);
});
//# sourceMappingURL=PayloadDelegateWebEncodeWorker.js.map