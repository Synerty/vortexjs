import { PayloadEnvelope } from "./PayloadEnvelope";
export declare let STOP_PROCESSING: string;
export declare class PayloadIO {
    private _endpoints;
    constructor();
    add(endpoint: any): void;
    remove(endpoint: any): void;
    process(payloadEnvelope: PayloadEnvelope): void;
}
export declare let payloadIO: PayloadIO;
