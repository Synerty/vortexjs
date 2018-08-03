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
        let {callNumber, promise} = this.pushPromise();

        this.encodeWorker.postMessage({
            callNumber: callNumber,
            payloadJson: payloadJson
        });

        return promise;

    }

    // ------------------------------------------------------------------------

    encodeEnvelope(payloadJson: string): Promise<string> {
        let {callNumber, promise} = this.pushPromise();

        this.encodeEnvelopeWorker.postMessage({
            callNumber: callNumber,
            payloadJson: payloadJson
        });

        return promise;

    }

    // ------------------------------------------------------------------------

    decodeAndInflate(vortexStr: string): Promise<string> {
        let {callNumber, promise} = this.pushPromise();

        this.decodeWorker.postMessage({
            callNumber: callNumber,
            vortexStr: vortexStr
        });

        return promise;

    }

    // ------------------------------------------------------------------------

    decodeEnvelope(vortexStr: string): Promise<string> {
        let {callNumber, promise} = this.pushPromise();

        this.decodeEnvelopeWorker.postMessage({
            callNumber: callNumber,
            vortexStr: vortexStr
        });

        return promise;
    }

    // ------------------------------------------------------------------------

    private static _promises = {};
    private static _promisesNum = 1;

    private pushPromise(): { callNumber: any; promise: Promise<any> } {
        let callNumber = PayloadDelegateNs._promisesNum++;

        // Roll it over
        if (PayloadDelegateNs._promisesNum > 10000) // 10 thousand
            PayloadDelegateNs._promisesNum = 1;

        let promise = new Promise((resolve, reject) => {
            PayloadDelegateNs._promises[callNumber] = {
                resolve: resolve,
                reject: reject
            };
        });

        return {callNumber, promise};
    }

    private static popPromise(callNumber: number): {} {
        let promise = PayloadDelegateNs._promises[callNumber];
        delete PayloadDelegateNs._promises[callNumber];
        return promise;
    }

    private static onMessage(postResult) {
        let resultAny: any = postResult.data;
        console.log(`PayloadDelegateNS, Receiving : ${JSON.stringify(resultAny)}`);

        let error = resultAny["error"];
        let callNumber = resultAny["callNumber"];
        let result = resultAny["result"];

        if (callNumber == null) {
            console.log(`PayloadDelegateNs.onerror ${error}`);
            return;
        }

        let promise = PayloadDelegateNs.popPromise(callNumber);

        if (promise == null) {
            console.log(`PayloadDelegateNs, Double worker callback ${error}`);
            return;
        }

        let resolve = promise["resolve"];
        let reject = promise["reject"];

        if (error == null) {
            setTimeout(() => resolve(result), 0);

        } else {
            reject(error);
        }
    }

    private static onError(error) {
        console.log(`PayloadDelegateNs.onerror ${error}`);
    }

}
