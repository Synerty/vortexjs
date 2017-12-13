"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pako = require("pako");
self.addEventListener('message', function (postedArg) {
    var compressedData = pako.deflate(postedArg["data"]["payloadJson"], { to: "string" });
    var encodedData = btoa(compressedData);
    self.postMessage({
        encodedData: encodedData,
        error: null
    }, undefined, undefined);
}, false);
self.addEventListener('error', function (e) {
    self.postMessage({
        encodedData: null,
        error: e
    }, undefined, undefined);
}, false);
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/payload/PayloadDelegateWebEncodeWorker.js.map