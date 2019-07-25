"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pako = require("pako");
var base64 = require("base-64");
var CALL_PAYLOAD_ENCODE = 1;
var CALL_PAYLOAD_DECODE = 2;
var CALL_PAYLOAD_ENVELOPE_ENCODE = 3;
var CALL_PAYLOAD_ENVELOPE_DECODE = 4;
function postError(callNumber, err) {
    var postArg = {
        callNumber: callNumber,
        result: null,
        error: err
    };
    //console.log(`WebSQL Worker, Sending ${postArg}`);
    global.postMessage(postArg);
}
function postResult(callNumber, result) {
    var postArg = {
        callNumber: callNumber,
        result: result,
        error: null
    };
    //console.log(`WebSQL Worker, Sending ${postArg}`);
    global.postMessage(postArg);
}
global.onmessage = function (postedArg) {
    var params = postedArg["data"];
    var call = params["call"];
    var callNumber = params["callNumber"];
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
    }
    catch (e) {
        return postError(callNumber, e.toString());
    }
};
global.onerror = postError;
function payloadEncode(params) {
    var compressedData = pako.deflate(params["payloadJson"], { to: "string" });
    return base64.encode(compressedData);
}
function payloadDecode(params) {
    var compressedData = base64.decode(params["vortexStr"]);
    return pako.inflate(compressedData, { to: "string" });
}
function payloadEnvelopeEncode(params) {
    return base64.encode(params["payloadEnvelopeJson"], { to: "string" });
}
function payloadEnvelopeDecode(params) {
    return base64.decode(params["vortexStr"]);
}
//# sourceMappingURL=PayloadDelegateNsWorker.js.map