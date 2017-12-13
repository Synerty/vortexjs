import * as pako from "pako";


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
