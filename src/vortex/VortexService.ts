import {IPayloadFilt, Payload} from "./Payload";
import {Injectable} from "@angular/core";
import {Tuple} from "./Tuple";
import {ComponentLifecycleEventEmitter} from "./ComponentLifecycleEventEmitter";
import {Observable} from "rxjs/Observable";
import {PayloadEndpoint} from "./PayloadEndpoint";
import {IFilterUpdateCallable, TupleLoader} from "./TupleLoader";
import {Ng2BalloonMsgService} from "@synerty/ng2-balloon-msg";
import {VortexStatusService} from "./VortexStatusService";
import {VortexClientABC} from "./VortexClientABC";
import {VortexClientHttp} from "./VortexClientHttp";
import {VortexClientWebsocket} from "./VortexClientWebsocket";
import {PayloadEnvelope} from "./PayloadEnvelope";

@Injectable()
export class VortexService {
    private vortex: VortexClientABC;
    private static vortexUrl: string = '/vortex';

    constructor(private vortexStatusService: VortexStatusService,
                private balloonMsg: Ng2BalloonMsgService) {
        //

        this.reconnect();
    }

    /**
     * Set Vortex URL
     *
     * This method should not be used except in rare cases, such as a NativeScript app.
     *
     * @param url: The new URL for the vortex to use.
     */
    static setVortexUrl(url: string) {
        VortexService.vortexUrl = url;
    }

    reconnect() {
        if (this.vortex != null)
            this.vortex.closed = true;

        if (VortexService.vortexUrl == null) {
            this.vortexStatusService.setOnline(false);
            return;
        }

        if (VortexService.vortexUrl.toLowerCase().startsWith("ws")) {
            this.vortex = new VortexClientWebsocket(
                this.vortexStatusService, VortexService.vortexUrl);
        } else {
            this.vortex = new VortexClientHttp(
                this.vortexStatusService, VortexService.vortexUrl);
        }

        this.vortex.reconnect();
    }

    sendTuple(filt: IPayloadFilt | string, tuples: any[] | Tuple[]): void {
        if (typeof filt === "string") {
            filt = {key: filt};
        }
        this.sendPayload(new Payload(filt, tuples));
    }

    sendFilt(filt): void {
        this.sendPayload(new Payload(filt));
    }

    /** Send Payload
     *
     * @param {Payload[] | Payload} payload
     * @returns {Promise<void>}
     */
    sendPayload(payload: Payload[] | Payload): Promise<void> {
        if (this.vortex == null) {
            throw new Error("The vortex is not initialised yet.");
        }

        let payloads: Payload[] = [];
        if (payload instanceof Array)
            payloads = payload;
        else
            payloads = [payload];

        let promises: Promise<void>[] = [];
        for (let payload of payloads) {
            promises.push(
                payload.makePayloadEnvelope()
                    .then((payloadEnvelope: PayloadEnvelope) =>  {
                        this.vortex.send(payloadEnvelope);
                    })
            );
        }
        let ret: any = Promise.all(promises);
        return ret;
    }

    /** Send Payload Envelope(s)
     *
     * @param {PayloadEnvelope[] | PayloadEnvelope} payloadEnvelope
     * @returns {Promise<void>}
     */
    sendPayloadEnvelope(payloadEnvelope: PayloadEnvelope[] | PayloadEnvelope): Promise<void> {
        if (this.vortex == null) {
            throw new Error("The vortex is not initialised yet.");
        }
        return this.vortex.send(payloadEnvelope);
    }

    createEndpointObservable(component: ComponentLifecycleEventEmitter,
                             filter: IPayloadFilt,
                             processLatestOnly: boolean = false): Observable<PayloadEnvelope> {
        let endpoint = new PayloadEndpoint(component, filter, processLatestOnly);

        return this.createEndpoint(component, filter, processLatestOnly).observable;
    }

    createEndpoint(component: ComponentLifecycleEventEmitter,
                   filter: IPayloadFilt,
                   processLatestOnly: boolean = false): PayloadEndpoint {
        return new PayloadEndpoint(component, filter, processLatestOnly);
    }

    createTupleLoader(component: ComponentLifecycleEventEmitter,
                      filterUpdateCallable: IFilterUpdateCallable | IPayloadFilt) {
        return new TupleLoader(this.vortex,
            component,
            filterUpdateCallable,
            this.balloonMsg
        );
    }
}
