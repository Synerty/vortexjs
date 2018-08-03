import { PayloadDelegateABC } from "./PayloadDelegateABC";
export declare class PayloadDelegateNs extends PayloadDelegateABC {
    private static readonly MAX_WORKERS;
    private workers;
    private nextWorkerIndex;
    constructor();
    private nextWorker();
    private createWorker();
    deflateAndEncode(payloadJson: string): Promise<string>;
    decodeAndInflate(vortexStr: string): Promise<string>;
    encodeEnvelope(payloadEnvelopeJson: string): Promise<string>;
    decodeEnvelope(vortexStr: string): Promise<string>;
    private static _promises;
    private static _promisesNum;
    private pushPromise();
    private static popPromise(callNumber);
    private static onMessage(postResult);
    private static onError(error);
}
