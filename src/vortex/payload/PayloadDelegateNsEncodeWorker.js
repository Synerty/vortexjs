"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pako = require("pako");
var base64 = require("base-64");
var registerPromiseWorker = require("promise-worker/register");
registerPromiseWorker(function (payloadJson) {
    var compressedData = pako.deflate(payloadJson, { to: "string" });
    return base64.encode(compressedData);
});
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/payload/PayloadDelegateNsEncodeWorker.js.map