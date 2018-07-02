import { IPayloadFilt, Payload } from "./Payload";
import { Tuple } from "./Tuple";
import { ComponentLifecycleEventEmitter } from "./ComponentLifecycleEventEmitter";
import { Observable } from "rxjs";
import { PayloadEndpoint } from "./PayloadEndpoint";
import { IFilterUpdateCallable, TupleLoader } from "./TupleLoader";
import { Ng2BalloonMsgService } from "@synerty/ng2-balloon-msg";
import { VortexStatusService } from "./VortexStatusService";
import { PayloadEnvelope } from "./PayloadEnvelope";
export declare class VortexService {
    private vortexStatusService;
    private balloonMsg;
    private vortex;
    private static vortexUrl;
    private static vortexClientName;
    constructor(vortexStatusService: VortexStatusService, balloonMsg: Ng2BalloonMsgService);
    /**
     * Set Vortex URL
     *
     * This method should not be used except in rare cases, such as a NativeScript app.
     *
     * @param url: The new URL for the vortex to use.
     */
    static setVortexUrl(url: string): void;
    /**
     * Set Vortex Name
     *
     * @param vortexClientName: The vortexClientName to tell the server that we are.
     */
    static setVortexClientName(vortexClientName: string): void;
    reconnect(): void;
    sendTuple(filt: IPayloadFilt | string, tuples: any[] | Tuple[]): void;
    sendFilt(filt: any): void;
    /** Send Payload
     *
     * @param {Payload[] | Payload} payload
     * @returns {Promise<void>}
     */
    sendPayload(payload: Payload[] | Payload): Promise<void>;
    /** Send Payload Envelope(s)
     *
     * @param {PayloadEnvelope[] | PayloadEnvelope} payloadEnvelope
     * @returns {Promise<void>}
     */
    sendPayloadEnvelope(payloadEnvelope: PayloadEnvelope[] | PayloadEnvelope): Promise<void>;
    createEndpointObservable(component: ComponentLifecycleEventEmitter, filter: IPayloadFilt, processLatestOnly?: boolean): Observable<PayloadEnvelope>;
    createEndpoint(component: ComponentLifecycleEventEmitter, filter: IPayloadFilt, processLatestOnly?: boolean): PayloadEndpoint;
    createTupleLoader(component: ComponentLifecycleEventEmitter, filterUpdateCallable: IFilterUpdateCallable | IPayloadFilt): TupleLoader;
}
