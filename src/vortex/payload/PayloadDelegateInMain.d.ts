import { PayloadDelegateABC } from "./PayloadDelegateABC";
export declare class PayloadDelegateInMain extends PayloadDelegateABC {
    deflateAndEncode(payloadJson: string): Promise<string>;
    decodeAndInflate(vortexStr: string): Promise<string>;
}
