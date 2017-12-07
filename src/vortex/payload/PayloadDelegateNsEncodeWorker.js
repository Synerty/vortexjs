var pako = require("pako");
var base64 = require("base-64");

onmessage = function (data) {
  var compressedData = pako.deflate(data.payloadJson, {to: "string"});
  var encodedData = base64.encode(compressedData);
  postMessage({
    encodedData: encodedData,
    error: null
  });
};


onerror = function (e) {
  postMessage({
    encodedData: null,
    error: e
  });
};

