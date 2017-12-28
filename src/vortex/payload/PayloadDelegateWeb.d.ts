import { PayloadDelegateABC } from "./PayloadDelegateABC";
export declare class PayloadDelegateWeb extends PayloadDelegateABC {
    deflateAndEncode(payloadJson: string): Promise<string>;
    decodeAndInflate(vortexStr: string): Promise<string>;
}
