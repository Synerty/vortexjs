import {PayloadDelegateABC} from "./PayloadDelegateABC";

export class PayloadDelegateNs extends PayloadDelegateABC {

  deflateAndEncode(payloadJson: string): Promise<string> {
    let worker = new Worker('./PayloadDelegateNsEncodeWorker.js');

    // var w;
    // if (global.TNS_WEBPACK) {
    //     var GrayscaleWorker = require("nativescript-worker-loader!./workers/grayscaler.js");
    //     w = new GrayscaleWorker();
    // } else {
    //     w = new Worker("./workers/grayscaler.js");
    // }

    return new Promise<string>((resolve, reject) => {

      function callError(error) {
        reject(error);
        console.log(
          `ERROR: PayloadDelegateNs.deflateAndEncode ${error}`
        );
      }

      worker.onmessage = (result) => {
        let resultAny: any = result.data;
        let error = resultAny["error"];

        if (error == null) {
          resolve(resultAny["encodedData"]);

        } else {
          callError(error);
        }

        worker.terminate();
      };

      worker.onerror = (error) => {
        callError(error);
        worker.terminate();
      };

      worker.postMessage({payloadJson: payloadJson});

    });

  }

  decodeAndInflate(vortexStr: string): Promise<string> {
    let worker = new Worker('./PayloadDelegateNsDecodeWorker.js');

    // var w;
    // if (global.TNS_WEBPACK) {
    //     var GrayscaleWorker = require("nativescript-worker-loader!./workers/grayscaler.js");
    //     w = new GrayscaleWorker();
    // } else {
    //     w = new Worker("./workers/grayscaler.js");
    // }

    return new Promise<string>((resolve, reject) => {

      function callError(error) {
        reject(error);
        console.log(
          `ERROR: PayloadDelegateNs.decodeAndInflate ${error}`
        );
      }

      worker.onmessage = (result) => {
        let resultAny: any = result.data;
        let error = resultAny["error"];

        if (error == null) {
          resolve(resultAny["payloadJson"]);

        } else {
          callError(error);
        }

        worker.terminate();
      };

      worker.onerror = (error) => {
        callError(error);
        worker.terminate();
      };

      worker.postMessage({vortexStr: vortexStr});

    });

  }

}
