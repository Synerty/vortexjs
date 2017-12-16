"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pako = require("pako");
var base64 = require("base-64");
global.onmessage = function (postedArg) {
    var callNumber = postedArg["data"]["callNumber"];
    try {
        var compressedData = pako.deflate(postedArg["data"]["payloadJson"], { to: "string" });
        var encodedData = base64.encode(compressedData);
        global.postMessage({
            callNumber: callNumber,
            result: encodedData,
            error: null
        });
    }
    catch (e) {
        global.postMessage({
            callNumber: callNumber,
            result: null,
            error: e.toString()
        });
    }
};
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/payload/PayloadDelegateNsEncodeWorker.js.map