"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pako = require("pako");
var base64 = require("base-64");
global.onmessage = function (postedArg) {
    var compressedData = pako.deflate(postedArg["data"]["payloadJson"], { to: "string" });
    var encodedData = base64.encode(compressedData);
    global.postMessage({
        encodedData: encodedData,
        error: null
    });
};
global.onerror = function (e) {
    global.postMessage({
        encodedData: null,
        error: e
    });
};
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/payload/PayloadDelegateNsEncodeWorker.js.map