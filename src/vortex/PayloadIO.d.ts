export declare let STOP_PROCESSING: string;
export declare class PayloadIO {
    private _endpoints;
    constructor();
    add(endpoint: any): void;
    remove(endpoint: any): void;
    process(payload: any): void;
}
export declare let payloadIO: PayloadIO;
