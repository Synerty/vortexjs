import {PayloadDelegateABC} from "./PayloadDelegateABC";
import {PayloadDelegateInMain} from "./PayloadDelegateInMain";

import * as PromiseWorker from "promise-worker";

declare let global: any;

export class PayloadDelegateNs extends PayloadDelegateABC {
    private encodeWorker: Worker;
    private decodeWorker: Worker;

    private encodePromiseWorker: PromiseWorker;
    private decodePromiseWorker: PromiseWorker;

    private inMainDelegate = new PayloadDelegateInMain();

    constructor() {
        super();
        if (global.TNS_WEBPACK) {
            let Worker = require("nativescript-worker-loader!./PayloadDelegateNsEncodeWorker.js");
            this.encodeWorker = new Worker();
        } else {
            this.encodeWorker = new Worker("./PayloadDelegateNsEncodeWorker.js");
        }
        this.encodePromiseWorker = new PromiseWorker(this.encodeWorker);

        if (global.TNS_WEBPACK) {
            let Worker = require("nativescript-worker-loader!./PayloadDelegateNsDecodeWorker.js");
            this.decodeWorker = new Worker();
        } else {
            this.decodeWorker = new Worker("./PayloadDelegateNsDecodeWorker.js");
        }
        this.decodePromiseWorker = new PromiseWorker(this.decodeWorker);

    }

    // ------------------------------------------------------------------------

    deflateAndEncode(payloadJson: string): Promise<string> {
        // Don't send small messages to the worker
        if (payloadJson.length < (10 * 1024))
            return this.inMainDelegate.deflateAndEncode(payloadJson);

        return this.encodePromiseWorker.postMessage(payloadJson);
    }

    // ------------------------------------------------------------------------

    encodeEnvelope(payloadJson: string): Promise<string> {
        return this.inMainDelegate.encodeEnvelope(payloadJson);
    }

    // ------------------------------------------------------------------------

    decodeAndInflate(vortexStr: string): Promise<string> {
        // Don't send small messages to the worker
        if (vortexStr.length < (5 * 1024))
            return this.inMainDelegate.decodeAndInflate(vortexStr);

        return this.decodePromiseWorker.postMessage(vortexStr);
    }

    // ------------------------------------------------------------------------

    decodeEnvelope(vortexStr: string): Promise<string> {
        return this.inMainDelegate.decodeEnvelope(vortexStr);
    }

    // ------------------------------------------------------------------------


}
