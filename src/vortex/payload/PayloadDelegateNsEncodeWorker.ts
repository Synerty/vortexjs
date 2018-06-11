import * as pako from "pako";
import * as base64 from "base-64";
import * as registerPromiseWorker from "promise-worker/register";

registerPromiseWorker((payloadJson: string) => {
    let compressedData = pako.deflate(payloadJson, {to: "string"});
    return base64.encode(compressedData);
});
