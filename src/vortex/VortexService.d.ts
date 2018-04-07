import { IPayloadFilt, Payload } from "./Payload";
import { NgZone } from "@angular/core";
import { Tuple } from "./Tuple";
import { ComponentLifecycleEventEmitter } from "./ComponentLifecycleEventEmitter";
import { Observable } from "rxjs/Observable";
import { PayloadEndpoint } from "./PayloadEndpoint";
import { IFilterUpdateCallable, TupleLoader } from "./TupleLoader";
import { Ng2BalloonMsgService } from "@synerty/ng2-balloon-msg";
import { VortexStatusService } from "./VortexStatusService";
export declare class VortexService {
    private vortexStatusService;
    private zone;
    private balloonMsg;
    private vortex;
    private static vortexUrl;
    constructor(vortexStatusService: VortexStatusService, zone: NgZone, balloonMsg: Ng2BalloonMsgService);
    /**
     * Set Vortex URL
     *
     * This method should not be used except in rare cases, such as a NativeScript app.
     *
     * @param url: The new URL for the vortex to use.
     */
    static setVortexUrl(url: string): void;
    reconnect(): void;
    sendTuple(filt: IPayloadFilt | string, tuples: any[] | Tuple[]): void;
    sendFilt(filt: any): void;
    /** Send Payload
     *
     * @param {Payload[] | Payload} payload
     * @returns {Promise<void>}
     */
    sendPayload(payload: Payload[] | Payload): Promise<void>;
    createEndpointObservable(component: ComponentLifecycleEventEmitter, filter: IPayloadFilt, processLatestOnly?: boolean): Observable<Payload>;
    createEndpoint(component: ComponentLifecycleEventEmitter, filter: IPayloadFilt, processLatestOnly?: boolean): PayloadEndpoint;
    createTupleLoader(component: ComponentLifecycleEventEmitter, filterUpdateCallable: IFilterUpdateCallable | IPayloadFilt): TupleLoader;
}
