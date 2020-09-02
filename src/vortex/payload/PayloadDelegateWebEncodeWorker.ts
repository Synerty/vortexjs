import * as pako from "pako"
import * as registerPromiseWorker from "promise-worker/register"

registerPromiseWorker((payloadJson: string) => {
    let compressedData = pako.deflate(payloadJson, {to: "string"})
    return btoa(compressedData)
})
