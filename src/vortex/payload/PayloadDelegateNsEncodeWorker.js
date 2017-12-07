
var pako = require("pako");
var base64 = require("base-64");

onmessage = function (data) {
    var compressedData = pako.deflate(data.payloadJson, { to: "string" });
    var encodedData = base64.encode(compressedData);
    postMessage({encodedData:encodedData});
};


// onerror = function (e) {
//     // console.log(e.toString());
//     // return true to not propagate to main
// };

