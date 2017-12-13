import * as pako from "pako";
import * as base64 from "base-64";

declare let global:any;

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
