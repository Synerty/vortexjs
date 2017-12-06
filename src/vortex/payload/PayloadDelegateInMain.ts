import * as pako from "pako";
import * as base64 from "base-64";

function btoa(data) {
  try {
    return window["btoa"](data);
  }
  catch (e) {
    return base64.encode(data);
  }
}

function atob(data) {
  try {
    return window["atob"](data);
  }
  catch (e) {
    return base64.decode(data);
  }
}

import {PayloadDelegateABC} from "./PayloadDelegateABC";

export class PayloadDelegateInMain extends PayloadDelegateABC {

  deflateAndEncode(payloadJson: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let compressedData = pako.deflate(payloadJson, {to: "string"});
      let encodedData = btoa(compressedData);
      resolve(encodedData);
    });
  }

  decodeAndInflate(vortexStr: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let compressedData = atob(vortexStr);
      let payloadJson = pako.inflate(compressedData, {to: "string"});
      resolve(payloadJson);
    });
  }

}
