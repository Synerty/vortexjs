"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pako = require("pako");
var registerPromiseWorker = require("promise-worker/register");
registerPromiseWorker(function (vortexStr) {
    var compressedData = atob(vortexStr);
    return pako.inflate(compressedData, { to: "string" });
});
//# sourceMappingURL=PayloadDelegateWebDecodeWorker.js.map