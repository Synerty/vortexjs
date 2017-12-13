import { PayloadDelegateABC } from "./PayloadDelegateABC";

declare let global: any;

export class PayloadDelegateNs extends PayloadDelegateABC {

  deflateAndEncode(payloadJson: string): Promise<string> {

    let worker;
    if (global.TNS_WEBPACK) {
      let Worker = require("nativescript-worker-loader!../PayloadDelegateNsEncodeWorker.js");
      worker = new Worker();
    } else {
      worker = new Worker("./PayloadDelegateNsEncodeWorker.js");
    }

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

      worker.postMessage({ payloadJson: payloadJson });

    });

  }

  decodeAndInflate(vortexStr: string): Promise<string> {

    let worker;
    if (global.TNS_WEBPACK) {
      let Worker = require("nativescript-worker-loader!./PayloadDelegateNsDecodeWorker.js");
      worker = new Worker();
    } else {
      worker = new Worker('./PayloadDelegateNsDecodeWorker.js');
    }

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

      worker.postMessage({ vortexStr: vortexStr });

    });

  }

}
