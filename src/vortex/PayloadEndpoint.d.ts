import { IPayloadFilt } from "./Payload";
import "./UtilArray";
import { ComponentLifecycleEventEmitter } from "./ComponentLifecycleEventEmitter";
import { Observable } from "rxjs";
import { PayloadEnvelope } from "./PayloadEnvelope";
export declare class PayloadEndpoint {
    private _observable;
    private _filt;
    private _lastPayloadDate;
    private _processLatestOnly;
    constructor(component: ComponentLifecycleEventEmitter, filter: IPayloadFilt, processLatestOnly?: boolean);
    get observable(): Observable<PayloadEnvelope>;
    /**
     * Process Payload
     * Check if the payload is meant for us then process it.
     *
     * @return null, or if the function is overloaded, you could return STOP_PROCESSING
     * from PayloadIO, which will tell it to stop processing further endpoints.
     */
    process(payloadEnvelope: PayloadEnvelope): null | string;
    private checkFilt;
    private checkDate;
    shutdown(): void;
}
