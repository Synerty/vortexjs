"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var base64 = require("base-64");
global.onmessage = function (postedArg) {
    var callNumber = postedArg["data"]["callNumber"];
    try {
        var payloadJson = base64.decode(postedArg["data"]["vortexStr"]);
        global.postMessage({
            callNumber: callNumber,
            result: payloadJson,
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
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/payload/PayloadEnvelopeDelegateNsDecodeWorker.js.map