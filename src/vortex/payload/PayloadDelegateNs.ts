import {PayloadDelegateABC} from "./PayloadDelegateABC";

export class PayloadDelegateNs extends PayloadDelegateABC {

  deflateAndEncode(payloadJson: string): Promise<string> {
    let worker = new Worker('./PayloadDelegateNsDecodeWorker.js');

    // var w;
    // if (global.TNS_WEBPACK) {
    //     var GrayscaleWorker = require("nativescript-worker-loader!./workers/grayscaler.js");
    //     w = new GrayscaleWorker();
    // } else {
    //     w = new Worker("./workers/grayscaler.js");
    // }

    return new Promise<string>((resolve, reject) => {

      worker.onmessage = (result) => {
        let resultAny:any = result;
        resolve(resultAny);
        worker.terminate();
      };

      worker.onerror = (error) => {
        reject(error);
        worker.terminate();
      };

      worker.postMessage(payloadJson);

    });

  }

  decodeAndInflate(vortexStr: string): Promise<string> {
    let worker = new Worker('./PayloadDelegateNsEncodeWorker.js');

    // var w;
    // if (global.TNS_WEBPACK) {
    //     var GrayscaleWorker = require("nativescript-worker-loader!./workers/grayscaler.js");
    //     w = new GrayscaleWorker();
    // } else {
    //     w = new Worker("./workers/grayscaler.js");
    // }

    return new Promise<string>((resolve, reject) => {

      worker.onmessage = (result) => {
        let resultAny:any = result;
        resolve(resultAny);
        worker.terminate();
      };

      worker.onerror = (error) => {
        reject(error);
        worker.terminate();
      };

      worker.postMessage(vortexStr);

    });

  }

}
