import * as base64 from "base-64";

declare let global:any;

global.onmessage = function (postedArg) {
  let callNumber = postedArg["data"]["callNumber"];

  try {
    let encodedData = base64.encode(postedArg["data"]["payloadJson"], { to: "string" });

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

