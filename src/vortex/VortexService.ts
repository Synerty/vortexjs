import {IPayloadFilt, Payload} from "./Payload";
import {Injectable, NgZone} from "@angular/core";
import {Tuple} from "./Tuple";
import {ComponentLifecycleEventEmitter} from "./ComponentLifecycleEventEmitter";
import {Observable} from "rxjs";
import {PayloadEndpoint} from "./PayloadEndpoint";
import {IFilterUpdateCallable, TupleLoader} from "./TupleLoader";
import {Ng2BalloonMsgService} from "@synerty/ng2-balloon-msg";
import {VortexStatusService} from "./VortexStatusService";
import {VortexClientABC} from "./VortexClientABC";
import {VortexClientHttp} from "./VortexClientHttp";
import {VortexClientWebsocket} from "./VortexClientWebsocket";

@Injectable()
export class VortexService {
    private vortex: VortexClientABC;
    private static vortexUrl: string = '/vortex';

    constructor(private vortexStatusService: VortexStatusService,
                private zone: NgZone,
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
                this.vortexStatusService, this.zone, VortexService.vortexUrl);
        } else {
            this.vortex = new VortexClientHttp(
                this.vortexStatusService, this.zone, VortexService.vortexUrl);
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
    sendPayload(payload:Payload[] | Payload): Promise<void> {
        if (this.vortex == null) {
            throw new Error("The vortex is not initialised yet.");
        }
        return this.vortex.send(payload);
    }

    createEndpointObservable(component: ComponentLifecycleEventEmitter,
                             filter: IPayloadFilt,
                             processLatestOnly: boolean = false): Observable<Payload> {
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
            this.zone,
            filterUpdateCallable,
            this.balloonMsg
        );
    }
}
