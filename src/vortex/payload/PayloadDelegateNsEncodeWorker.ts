import * as pako from "pako";
import * as base64 from "base-64";

declare let global:any;

global.onmessage = function (postedArg) {
  let callNumber = postedArg["data"]["callNumber"];

  try {
    var compressedData = pako.deflate(postedArg["data"]["payloadJson"], { to: "string" });
    var encodedData = base64.encode(compressedData);

    global.postMessage({
      callNumber: callNumber,
      result: encodedData,
      error: null
    });
    
  } catch (e) {
    global.postMessage({
      callNumber: callNumber,
      result: null,
      error: e.toString()
    });
  }

};

