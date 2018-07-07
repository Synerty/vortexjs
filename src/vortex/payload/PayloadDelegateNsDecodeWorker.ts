import * as pako from "pako";
import * as base64 from "base-64";

declare let global:any;

global.onmessage = function (postedArg) {
  let callNumber = postedArg["data"]["callNumber"];

  try {
    let compressedData = base64.decode(postedArg["data"]["vortexStr"]);
    let payloadJson = pako.inflate(compressedData, { to: "string" });

    global.postMessage({
      callNumber: callNumber,
      result: payloadJson,
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
