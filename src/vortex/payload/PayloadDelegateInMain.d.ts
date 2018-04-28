import { PayloadDelegateABC } from "./PayloadDelegateABC";
export declare class PayloadDelegateInMain extends PayloadDelegateABC {
    deflateAndEncode(payloadJson: string): Promise<string>;
    encodeEnvelope(payloadJson: string): Promise<string>;
    decodeAndInflate(vortexStr: string): Promise<string>;
    decodeEnvelope(vortexStr: string): Promise<string>;
}
