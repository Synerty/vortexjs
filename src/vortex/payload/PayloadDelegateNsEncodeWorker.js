
var pako = require("pako");
var base64 = require("base-64");

onmessage = function (payloadJson) {
    var compressedData = pako.deflate(payloadJson, { to: "string" });
    var encodedData = base64.encode(compressedData);
    postMessage(encodedData);
};


// onerror = function (e) {
//     // console.log(e.toString());
//     // return true to not propagate to main
// };

