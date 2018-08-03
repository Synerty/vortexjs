import * as pako from "pako";
import * as base64 from "base-64";

declare let global: any;

const CALL_PAYLOAD_ENCODE = 1;
const CALL_PAYLOAD_DECODE = 2;
const CALL_PAYLOAD_ENVELOPE_ENCODE = 3;
const CALL_PAYLOAD_ENVELOPE_DECODE = 4;

function postError(callNumber: number, err: any): void {
    let postArg = {
        callNumber: callNumber,
        result: null,
        error: err
    };
    //console.log(`WebSQL Worker, Sending ${postArg}`);
    global.postMessage(postArg);
}

function postResult(callNumber: number, result: any): void {
    let postArg = {
        callNumber: callNumber,
        result: result,
        error: null
    };
    //console.log(`WebSQL Worker, Sending ${postArg}`);
    global.postMessage(postArg);
}


global.onmessage = (postedArg) => {
    let params: any = postedArg["data"];

    let call: number = params["call"];
    let callNumber: number = params["callNumber"];

    try {
        switch (call) {
            case CALL_PAYLOAD_ENCODE:
                return postResult(callNumber, payloadEncode(params));

            case CALL_PAYLOAD_DECODE:
                return postResult(callNumber, payloadDecode(params));

            case CALL_PAYLOAD_ENVELOPE_ENCODE:
                return postResult(callNumber, payloadEnvelopeEncode(params));

            case CALL_PAYLOAD_ENVELOPE_DECODE:
                return postResult(callNumber, payloadEnvelopeDecode(params));

        }
    } catch (e) {
        return postError(callNumber, e.toString());
    }


};


global.onerror = postError;

function payloadEncode(params: any): any {
    let compressedData = pako.deflate(params["payloadJson"], {to: "string"});
    return base64.encode(compressedData);
}

function payloadDecode(params: any): any {
    let compressedData = base64.decode(params["vortexStr"]);
    return pako.inflate(compressedData, {to: "string"});
}

function payloadEnvelopeEncode(params: any): any {
    return base64.encode(params["payloadEnvelopeJson"], {to: "string"});
}

function payloadEnvelopeDecode(params: any): any {
    return base64.decode(params["vortexStr"]);
}
