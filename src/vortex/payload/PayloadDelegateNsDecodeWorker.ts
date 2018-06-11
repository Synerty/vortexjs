import * as pako from "pako";
import * as base64 from "base-64";
import * as registerPromiseWorker from "promise-worker/register";

registerPromiseWorker((vortexStr: string) => {
    let compressedData = base64.decode(vortexStr);
    return pako.inflate(compressedData, {to: "string"});
});

