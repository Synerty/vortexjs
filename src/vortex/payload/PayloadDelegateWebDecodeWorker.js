"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pako = require("pako");
self.addEventListener('message', function (postedArg) {
    var compressedData = atob(postedArg["data"]["vortexStr"]);
    var payloadJson = pako.inflate(compressedData, { to: "string" });
    self.postMessage({
        payloadJson: payloadJson,
        error: null
    }, undefined, undefined);
}, false);
self.addEventListener('error', function (e) {
    self.postMessage({
        payloadJson: null,
        error: e
    }, undefined, undefined);
}, false);
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/payload/PayloadDelegateWebDecodeWorker.js.map