import {PayloadDelegateABC} from "./PayloadDelegateABC";
import {PayloadDelegateInMain} from "./PayloadDelegateInMain";

export class PayloadDelegateWeb extends PayloadDelegateABC {

    private inMainDelegate = new PayloadDelegateInMain();


    deflateAndEncode(payloadJson: string): Promise<string> {
        // Don't send small messages to the worker
        if (payloadJson.length < (10 * 1024))
            return this.inMainDelegate.deflateAndEncode(payloadJson);

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

            worker.addEventListener('error', (error) => {
                callError(error);
                worker.terminate();
            }, false);

            worker.postMessage({payloadJson: payloadJson});

        });

    }

    // ------------------------------------------------------------------------

    encodeEnvelope(payloadJson: string): Promise<string> {
        return this.inMainDelegate.encodeEnvelope(payloadJson);

    }

    decodeAndInflate(vortexStr: string): Promise<string> {
        // Don't send small messages to the worker
        if (vortexStr.length < (5 * 1024))
            return this.inMainDelegate.decodeAndInflate(vortexStr);

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

            worker.addEventListener('error', (error) => {
                callError(error);
                worker.terminate();
            }, false);

            worker.postMessage({vortexStr: vortexStr});

        });

    }

    // ------------------------------------------------------------------------

    decodeEnvelope(vortexStr: string): Promise<string> {
        return this.inMainDelegate.decodeEnvelope(vortexStr);
    }

}
