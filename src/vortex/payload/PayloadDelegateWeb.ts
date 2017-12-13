import {PayloadDelegateABC} from "./PayloadDelegateABC";

export class PayloadDelegateWeb extends PayloadDelegateABC {

  deflateAndEncode(payloadJson: string): Promise<string> {
    let worker = new Worker('./PayloadDelegateWebEncodeWorker.js');

    return new Promise<string>((resolve, reject) => {

      function callError(error) {
        reject(error);
        console.log(
          `ERROR: PayloadDelegateWeb.deflateAndEncode ${error}`
        );
      }

      worker.addEventListener('message', (result) => {
        let resultAny: any = result["data"];
        let error = resultAny.error;

        if (error == null) {
          resolve(resultAny["encodedData"]);

        } else {
          callError(error);
        }

        worker.terminate();
      }, false);

      worker.addEventListener('error' , (error) => {
        callError(error);
        worker.terminate();
      }, false);

      worker.postMessage({payloadJson: payloadJson});

    });

  }

  decodeAndInflate(vortexStr: string): Promise<string> {
    let worker = new Worker('./PayloadDelegateWebDecodeWorker.js');

    return new Promise<string>((resolve, reject) => {

      function callError(error) {
        reject(error);
        console.log(
          `ERROR: PayloadDelegateWeb.decodeAndInflate ${error}`
        );
      }

      worker.addEventListener('message', (result) => {
        let resultAny: any = result["data"];
        let error = resultAny.error;

        if (error == null) {
          resolve(resultAny["payloadJson"]);

        } else {
          callError(error);
        }

        worker.terminate();
      }, false);

      worker.addEventListener('error' , (error) => {
        callError(error);
        worker.terminate();
      }, false);

      worker.postMessage({vortexStr: vortexStr});

    });

  }

}
