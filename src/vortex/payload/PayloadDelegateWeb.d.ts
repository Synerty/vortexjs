import { PayloadDelegateABC } from "./PayloadDelegateABC";
export declare class PayloadDelegateWeb extends PayloadDelegateABC {
    private inMainDelegate;
    deflateAndEncode(payloadJson: string): Promise<string>;
    encodeEnvelope(payloadJson: string): Promise<string>;
    decodeAndInflate(vortexStr: string): Promise<string>;
    decodeEnvelope(vortexStr: string): Promise<string>;
}
