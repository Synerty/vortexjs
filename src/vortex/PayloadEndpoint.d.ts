import { Payload, IPayloadFilt } from "./Payload";
import "./UtilArray";
import { ComponentLifecycleEventEmitter } from "./ComponentLifecycleEventEmitter";
import { Observable } from "rxjs";
export declare class PayloadEndpoint {
    private _observable;
    private _observer;
    private _filt;
    private _lastPayloadDate;
    private _processLatestOnly;
    constructor(component: ComponentLifecycleEventEmitter, filter: IPayloadFilt, processLatestOnly?: boolean);
    readonly observable: Observable<Payload>;
    /**
     * Process Payload
     * Check if the payload is meant for us then process it.
     *
     * @return null, or if the function is overloaded, you could return STOP_PROCESSING
     * from PayloadIO, which will tell it to stop processing further endpoints.
     */
    process(payload: Payload): null | string;
    private checkFilt(leftFilt, rightFilt);
    private checkDate(payload);
    shutdown(): void;
}