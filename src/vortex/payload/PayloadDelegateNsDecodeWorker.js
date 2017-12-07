var pako = require("pako");
var base64 = require("base-64");

onmessage = function (data) {
  var compressedData = base64.decode(data.vortexStr);
  var payloadJson = pako.inflate(compressedData, {to: "string"});
  postMessage({payloadJson: payloadJson});
};


// onerror = function (e) {
//     // console.log(e.toString());
//     // return true to not propagate to main
// };
