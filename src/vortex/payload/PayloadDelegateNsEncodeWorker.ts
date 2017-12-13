import * as pako from "pako";
import * as base64 from "base-64";

declare let global:any;

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

