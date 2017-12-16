import { PayloadDelegateABC } from "./PayloadDelegateABC";
import {PayloadDelegateInMain} from "./PayloadDelegateInMain";

declare let global: any;

export class PayloadDelegateNs extends PayloadDelegateABC {
  private encodeWorker:Worker;
  private decodeWorker:Worker;

  private inMainDelegate = new PayloadDelegateInMain();

  constructor() {
    super();
    if (global.TNS_WEBPACK) {
      let Worker = require("nativescript-worker-loader!../PayloadDelegateNsEncodeWorker.js");
      this.encodeWorker = new Worker();
    } else {
      this.encodeWorker = new Worker("./PayloadDelegateNsEncodeWorker.js");
    }

    this.encodeWorker.onmessage = PayloadDelegateNs.onMessage;
    this.encodeWorker.onerror = PayloadDelegateNs.onError;

    if (global.TNS_WEBPACK) {
      let Worker = require("nativescript-worker-loader!../PayloadDelegateNsDecodeWorker.js");
      this.decodeWorker = new Worker();
    } else {
      this.decodeWorker = new Worker("./PayloadDelegateNsDecodeWorker.js");
    }

    this.decodeWorker.onmessage = PayloadDelegateNs.onMessage;
    this.decodeWorker.onerror = PayloadDelegateNs.onError;
  }

  deflateAndEncode(payloadJson: string): Promise<string> {
    // Don't send small messages to the worker
    if (payloadJson.length < (10 * 1024))
      return this.inMainDelegate.deflateAndEncode(payloadJson);

    return new Promise<string>((resolve, reject) => {
      let callNumber = PayloadDelegateNs.pushPromise(resolve, reject);

      this.encodeWorker.postMessage({
        callNumber:callNumber,
        payloadJson: payloadJson
        });

    });

  }

  decodeAndInflate(vortexStr: string): Promise<string> {
    // Don't send small messages to the worker
    if (vortexStr.length < (5 * 1024))
      return this.inMainDelegate.decodeAndInflate(vortexStr);

    return new Promise<string>((resolve, reject) => {
      let callNumber = PayloadDelegateNs.pushPromise(resolve, reject);

      this.decodeWorker.postMessage({ 
        callNumber:callNumber,
        vortexStr: vortexStr 
      });

    });

  } // ------------------------------------------------------------------------

    static _promises = {};
    static _promisesNum = 1;

    static popPromise(callNumber: number): {} {
        let promise = PayloadDelegateNs._promises[callNumber];
        delete PayloadDelegateNs._promises[callNumber];
        return promise;
    }

    static pushPromise(resolve, reject): number {
      let callNumber = PayloadDelegateNs._promisesNum++;
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
