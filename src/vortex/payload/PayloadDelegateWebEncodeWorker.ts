import * as pako from "pako";


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

