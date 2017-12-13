"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pako = require("pako");
var base64 = require("base-64");
global.onmessage = function (postedArg) {
    var compressedData = base64.decode(postedArg["data"]["vortexStr"]);
    var payloadJson = pako.inflate(compressedData, { to: "string" });
    global.postMessage({
        payloadJson: payloadJson,
        error: null
    });
};
global.onerror = function (e) {
    global.postMessage({
        payloadJson: null,
        error: e
    });
};
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/payload/PayloadDelegateNsDecodeWorker.js.map