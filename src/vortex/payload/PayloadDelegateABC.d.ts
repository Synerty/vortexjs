export declare function now(): any;
export declare function logLong(message: string, start: any, payload?: any | null): void;
export declare abstract class PayloadDelegateABC {
    abstract deflateAndEncode(payloadJson: string): Promise<string>;
    abstract encodeEnvelope(payloadJson: string): Promise<string>;
    abstract decodeAndInflate(vortexStr: string): Promise<string>;
    abstract decodeEnvelope(vortexStr: string): Promise<string>;
}
