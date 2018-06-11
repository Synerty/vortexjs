"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pako = require("pako");
var base64 = require("base-64");
var registerPromiseWorker = require("promise-worker/register");
registerPromiseWorker(function (vortexStr) {
    var compressedData = base64.decode(vortexStr);
    return pako.inflate(compressedData, { to: "string" });
});
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/payload/PayloadDelegateNsDecodeWorker.js.map