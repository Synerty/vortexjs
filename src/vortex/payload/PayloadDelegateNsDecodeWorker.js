var pako = require("pako");
var base64 = require("base-64");

onmessage = function (data) {
  var compressedData = base64.decode(data.vortexStr);
  var payloadJson = pako.inflate(compressedData, {to: "string"});
  postMessage({
    payloadJson: payloadJson,
    error: null
  });
};

onerror = function (e) {
  postMessage({
    payloadJson: null,
    error: e
  });
};
