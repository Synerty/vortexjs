import * as pako from "pako"
import * as registerPromiseWorker from "promise-worker/register"

registerPromiseWorker((vortexStr: string) => {
    let compressedData = atob(vortexStr)
    return pako.inflate(compressedData, {to: "string"})
})

