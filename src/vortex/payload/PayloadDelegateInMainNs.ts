import * as pako from "pako";
import * as base64 from "base-64";
import {PayloadDelegateABC} from "./PayloadDelegateABC";

function btoa(data) {
    return base64.encode(data);
}

function atob(data) {
    return base64.decode(data);
}

export class PayloadDelegateInMainNs extends PayloadDelegateABC {

    deflateAndEncode(payloadJson: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            setTimeout(() => {
                let compressedData = pako.deflate(payloadJson, {to: "string"});
                setTimeout(() => {
                    let encodedData = btoa(compressedData);
                    resolve(encodedData);
                }, 0);
            }, 0);
        });
    }

    encodeEnvelope(payloadJson: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            setTimeout(() => {
                let encodedData = btoa(payloadJson);
                resolve(encodedData);
            }, 0);
        });
    }

    decodeAndInflate(vortexStr: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            setTimeout(() => {
                let compressedData = atob(vortexStr);
                setTimeout(() => {
                    let payloadJson = pako.inflate(compressedData, {to: "string"});
                    resolve(payloadJson);
                }, 0);
            }, 0);
        });
    }

    decodeEnvelope(vortexStr: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            setTimeout(() => {
                let payloadJson = atob(vortexStr);
                resolve(payloadJson);
            }, 0);
        });
    }

}
