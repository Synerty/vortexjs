import { PayloadDelegateABC } from "./PayloadDelegateABC";
export declare class PayloadDelegateNs extends PayloadDelegateABC {
    private encodeWorker;
    private decodeWorker;
    private encodeEnvelopeWorker;
    private decodeEnvelopeWorker;
    constructor();
    deflateAndEncode(payloadJson: string): Promise<string>;
    encodeEnvelope(payloadJson: string): Promise<string>;
    decodeAndInflate(vortexStr: string): Promise<string>;
    decodeEnvelope(vortexStr: string): Promise<string>;
    private static _promises;
    private static _promisesNum;
    private pushPromise();
    private static popPromise(callNumber);
    private static onMessage(postResult);
    private static onError(error);
}
