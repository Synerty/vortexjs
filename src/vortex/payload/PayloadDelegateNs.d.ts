import { PayloadDelegateABC } from "./PayloadDelegateABC";
export declare class PayloadDelegateNs extends PayloadDelegateABC {
    private encodeWorker;
    private decodeWorker;
    private inMainDelegate;
    constructor();
    deflateAndEncode(payloadJson: string): Promise<string>;
    encodeEnvelope(payloadJson: string): Promise<string>;
    decodeAndInflate(vortexStr: string): Promise<string>;
    decodeEnvelope(vortexStr: string): Promise<string>;
    static _promises: {};
    static _promisesNum: number;
    static popPromise(callNumber: number): {};
    static pushPromise(resolve: any, reject: any): number;
    static onMessage(postResult: any): void;
    static onError(error: any): void;
}
