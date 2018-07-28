import {PayloadDelegateABC} from "./PayloadDelegateABC";
import {PayloadDelegateInMainWeb} from "./PayloadDelegateInMainWeb";

import * as PromiseWorker from "promise-worker";

export class PayloadDelegateWeb extends PayloadDelegateABC {

    private encodeWorker: Worker;
    private decodeWorker: Worker;

    private encodePromiseWorker: PromiseWorker;
    private decodePromiseWorker: PromiseWorker;

    private inMainDelegate = new PayloadDelegateInMainWeb();

    constructor() {
        super();
        this.encodeWorker = new Worker('./PayloadDelegateWebEncodeWorker.js');
        this.encodePromiseWorker = new PromiseWorker(this.encodeWorker);

        this.decodeWorker = new Worker('./PayloadDelegateWebDecodeWorker.js');
        this.decodePromiseWorker = new PromiseWorker(this.decodeWorker);

    }


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

}
