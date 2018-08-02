import {PayloadDelegateABC} from "./PayloadDelegateABC";

declare let global: any;

export class PayloadDelegateNs extends PayloadDelegateABC {
    private encodeWorker: Worker;
    private decodeWorker: Worker;
    private encodeEnvelopeWorker: Worker;
    private decodeEnvelopeWorker: Worker;

    constructor() {
        super();
        // --------------------------------------------------------------------
        if (global.TNS_WEBPACK) {
            let Worker = require("nativescript-worker-loader!./PayloadDelegateNsEncodeWorker.js");
            this.encodeWorker = new Worker();
        } else {
            this.encodeWorker = new Worker("./PayloadDelegateNsEncodeWorker.js");
        }

        this.encodeWorker.onmessage = PayloadDelegateNs.onMessage;
        this.encodeWorker.onerror = PayloadDelegateNs.onError;

        // --------------------------------------------------------------------
        if (global.TNS_WEBPACK) {
            let Worker = require("nativescript-worker-loader!./PayloadDelegateNsDecodeWorker.js");
            this.decodeWorker = new Worker();
        } else {
            this.decodeWorker = new Worker("./PayloadDelegateNsDecodeWorker.js");
        }

        this.decodeWorker.onmessage = PayloadDelegateNs.onMessage;
        this.decodeWorker.onerror = PayloadDelegateNs.onError;

        // --------------------------------------------------------------------
        if (global.TNS_WEBPACK) {
            let Worker = require("nativescript-worker-loader!./PayloadEnvelopeDelegateNsEncodeWorker.js");
            this.encodeEnvelopeWorker = new Worker();
        } else {
            this.encodeEnvelopeWorker = new Worker("./PayloadEnvelopeDelegateNsEncodeWorker.js");
        }

        this.encodeEnvelopeWorker.onmessage = PayloadDelegateNs.onMessage;
        this.encodeEnvelopeWorker.onerror = PayloadDelegateNs.onError;

        // --------------------------------------------------------------------
        if (global.TNS_WEBPACK) {
            let Worker = require("nativescript-worker-loader!./PayloadEnvelopeDelegateNsDecodeWorker.js");
            this.decodeEnvelopeWorker = new Worker();
        } else {
            this.decodeEnvelopeWorker = new Worker("./PayloadEnvelopeDelegateNsDecodeWorker.js");
        }

        this.decodeEnvelopeWorker.onmessage = PayloadDelegateNs.onMessage;
        this.decodeEnvelopeWorker.onerror = PayloadDelegateNs.onError;
    }

    // ------------------------------------------------------------------------

    deflateAndEncode(payloadJson: string): Promise<string> {

        return new Promise<string>((resolve, reject) => {
            let callNumber = PayloadDelegateNs.pushPromise(resolve, reject);

            this.encodeWorker.postMessage({
                callNumber: callNumber,
                payloadJson: payloadJson
            });

        });

    }

    // ------------------------------------------------------------------------

    encodeEnvelope(payloadJson: string): Promise<string> {

        return new Promise<string>((resolve, reject) => {
            let callNumber = PayloadDelegateNs.pushPromise(resolve, reject);

            this.encodeEnvelopeWorker.postMessage({
                callNumber: callNumber,
                payloadJson: payloadJson
            });

        });

    }

    // ------------------------------------------------------------------------

    decodeAndInflate(vortexStr: string): Promise<string> {

        return new Promise<string>((resolve, reject) => {
            let callNumber = PayloadDelegateNs.pushPromise(resolve, reject);

            this.decodeWorker.postMessage({
                callNumber: callNumber,
                vortexStr: vortexStr
            });

        });

    }

    // ------------------------------------------------------------------------

    decodeEnvelope(vortexStr: string): Promise<string> {

        return new Promise<string>((resolve, reject) => {
            let callNumber = PayloadDelegateNs.pushPromise(resolve, reject);

            this.decodeEnvelopeWorker.postMessage({
                callNumber: callNumber,
                vortexStr: vortexStr
            });

        });
    }

    // ------------------------------------------------------------------------

    static _promises = {};
    static _promisesNum = 1;

    static popPromise(callNumber: number): {} {
        let promise = PayloadDelegateNs._promises[callNumber];
        delete PayloadDelegateNs._promises[callNumber];
        return promise;
    }

    static pushPromise(resolve, reject): number {
        let callNumber = PayloadDelegateNs._promisesNum++;

        // Roll it over
        if (PayloadDelegateNs._promisesNum > 1000000) // 1 million
            PayloadDelegateNs._promisesNum = 1;

        PayloadDelegateNs._promises[callNumber] = {
            resolve: resolve,
            reject: reject
        };
        return callNumber;
    }

    static onMessage(postResult) {
        let resultAny: any = postResult.data;
        // console.log(`WebSQL Service, Tx Receiving : ${JSON.stringify(resultAny)}`);

        let error = resultAny["error"];
        let callNumber = resultAny["callNumber"];
        let result = resultAny["result"];

        let promise = PayloadDelegateNs.popPromise(callNumber);
        let resolve = promise["resolve"];
        let reject = promise["reject"];

        if (error == null) {
            resolve(result);

        } else {
            reject(error);
        }
    }

    static onError(error) {
        console.log(`PayloadDelegateNs.onerror ${error}`);
    }

}
