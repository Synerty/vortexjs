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

        if (VortexService.vortexUrl.toLowerCase().startsWith("ws")) {
            this.vortex = new VortexClientWebsocket(
                vortexStatusService, zone, VortexService.vortexUrl);
        } else {
            this.vortex = new VortexClientHttp(
                vortexStatusService, zone, VortexService.vortexUrl);
        }
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

    sendPayload(payload): void {
        this.vortex.send(payload);
    }

    createEndpointObservable(component: ComponentLifecycleEventEmitter,
                             filter: IPayloadFilt,
                             processLatestOnly: boolean = false): Observable < Payload > {
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
