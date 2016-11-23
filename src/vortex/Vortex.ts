import Payload, {IPayloadFilt} from "./Payload";
import payloadIO from "./PayloadIO";
import {rapuiClientEcho} from "./PayloadFiterKeys";
import {getFiltStr, dateStr, bind} from "./UtilMisc";
import {Injectable} from "@angular/core";
import {Tuple} from "./Tuple";
import {Ng2CompLifecycleEvent} from "./Ng2CompLifecycleEvent";
import {Observable} from "rxjs";
import PayloadEndpoint from "./PayloadEndpoint";

/**
 * Server response timeout in milliseconds
 * @type {number}
 */
export let SERVER_RESPONSE_TIMEOUT = 20000;

@Injectable()
export class VortexService {
    private vortex: Vortex;

    constructor() {
        let self = this;
        self.vortex = new Vortex();
    }

    sendTuple(filt: IPayloadFilt | string, tuples: any[] | Tuple[]): void {
        let self = this;

        if (typeof filt === "string") {
            filt = {key: filt};
        }

        self.sendPayload(new Payload(filt, tuples));
    }

    sendFilt(filt): void {
        let self = this;
        this.sendPayload(new Payload(filt));
    }

    sendPayload(payload): void {
        let self = this;
        self.vortex.send(payload);
    }

    createEndpointObservable(component: Ng2CompLifecycleEvent,
                             filter: IPayloadFilt,
                             processLatestOnly: boolean = false): Observable<Payload> {
        let endpoint = new PayloadEndpoint(component, filter, processLatestOnly);

        return endpoint.observer();
    }

    createTupleLoader(component: Ng2CompLifecycleEvent,
                 vortex:Vortex,
                payloadFilt: IPayloadFilt,
        {
            tupleType,
            vortexSendFilt,
            objName = "data",
            objId,
            scopeObjIdName,
            scopeSetObjIdFunc,
            loadOnInit = true,
            loadOnIdChange = true,
            dataIsArray = false,
            actionPostfix
        }: INg2TupleLoaderParams) {)
}

export class Vortex {

    private _buffer: Payload[];
    private _beatTimer: any;
    private _uuid: string;
    private _vortexClosed: boolean;

    private serverVortexUuid: string | null;

    /**
     * RapUI VortexService, This class is responsible for sending and receiving payloads to/from
     * the server.
     */
    constructor() {
        let self = this;

        self._buffer = null;
        self._beatTimer = null;
        self._uuid = self._makeUuid();
        self._vortexClosed = false;

        self.serverVortexUuid = null;

        self.reconnect();
    }

    private _makeUuid() {
        function func(c) {
            let r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }

        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, func);
    }

    get uuid() {
        let self = this;
        return self._uuid;
    }

    get closed(): boolean {
        return this._vortexClosed;
    }

    set closed(value: boolean) {
        this._vortexClosed = value;
    }

    send(payload: Payload): void {
        let self = this;
        if (self._vortexClosed) {
            console.log(dateStr() + "VortexService is closed, Probably due to a login page reload");
            return;
        }

        if (payload == null) {
            payload = new Payload();

        } else if (payload.filt["key"] == null) {
            throw new Error("There is no 'key' in the payload filt"
                + ", There must be one for routing");

        }

        let conn = new VortexConnection(self);
        conn.send(payload);
        console.log(dateStr() + "Sent payload with filt : " + JSON.stringify(payload.filt));
    }

    reconnect(): void {
        let self = this;
        self.send(new Payload());
    }

    private _beat(): void {
        let self = this;

        // console.log(dateStr() + 'VortexService beating');

        if (self._beatTimer != null)
            clearInterval(self._beatTimer);

        self._beatTimer = setInterval(function () {
            self._dead();
            self.reconnect();
        }, 15000);
    }

    private _dead(): void {
        let self = this;
        console.log(dateStr() + "VortexService server heartbeats have timed out");
    }

    /**
     * Receive
     * This should only be called only from VortexConnection
     * @param payload {Payload}
     * @private
     */
    _receive(payload: Payload): void {
        let self = this;
        self._beat();
        if (payload.filt.hasOwnProperty(rapuiClientEcho)) {
            delete payload[rapuiClientEcho];
            self.send(payload);
        }

        if (payload.isEmpty()) {
            if (payload.filt[Payload.vortexUuidKey] != null)
                self.serverVortexUuid = payload.filt[Payload.vortexUuidKey];
            return;
        }

        console.log(dateStr() + "Received payload with filt : " + JSON.stringify(payload.filt));

        // TODO, Tell the payloadIO the vortexUuid
        payloadIO.process(payload);
    }
}

// ############################################################################
class VortexConnection {


    private static readonly RECONNECT_SIZE_LIMIT = 20 * 1024 * 1024; // 20 megabytes

    private _vortex: Vortex;
    private _http: XMLHttpRequest;
    private _updateTimer: any;
    private _responseParseIndex: number;
    private _closing: boolean;
    private _aborting: boolean;


    constructor(vortex: Vortex) {
        let self = this;

        self._vortex = vortex;

        let randArg = Math.random() + "." + (new Date()).getTime();
        let args = {
            "vortexUuid": vortex.uuid,
            "__randArg__": randArg
        };

        self._http = new XMLHttpRequest();
        self._http.open("POST", "/vortex" + getFiltStr(args), true);

        self._updateTimer = null;

        // Good events
        self._http.onloadstart = function (e) {
            self._received();

            // Force a 50 millisecond timer, as some browsers don't call "onprogress"
            // very often.
            self._updateTimer = setInterval(function () {
                self._received();
            }, 50);
        };

        self._http.onprogress = function (e) {
            self._received();
        };

        self._http.onload = function (e) {
            if (self._updateTimer)
                clearInterval(self._updateTimer);
            self._received();
        };

        // Bad events
        self._http.onabort = bind(self, self._error);
        self._http.onerror = bind(self, self._error);
        self._http.ontimeout = bind(self, self._error);

        self._responseParseIndex = 0;
        self._closing = false;
        self._aborting = false;
    }

    send(payloads: Payload | Payload[]) {
        let self = this;

        if (!(payloads instanceof Array))
            payloads = [payloads];

        let data = "";

        for (let i = 0; i < payloads.length; i++) {
            let payload = payloads[i];

            // Serialise the payload
            data += payload.toVortexMsg() + ".";
        }
        // console.log("sending payload");
        // console.log(xmlStr);
        self._http.send(data);
    }

    private _received() {
        let self = this;
        /*
         * Received
         *
         * Called when progress is made on receiving data from the vortex server.
         *
         * This means that it needs to be able to handle : * partial payloads (in
         * which case it does nothing) * multiple payloads (in which case, it breaks
         * them up, parses them and sends them to vortex individually)
         */

        if (self._aborting)
            return;

        // If we receive something that is not valid vortex data, then reload the page
        // This typically occurs when we're receving HTML because we're not logged in.
        if ((/^</).test(self._http.responseText)) {

            self._vortex.closed = true;
            self._closing = true;
            self._aborting = true;
            self._http.abort();

            location.reload();
            return;
        }

        // Split out the payloads of data, they are delimited by a '.'
        let data = self._http.responseText.substr(self._responseParseIndex);
        let payloadSeparatorIndex = data.indexOf(".");

        while (payloadSeparatorIndex !== -1) {
            self._responseParseIndex += payloadSeparatorIndex + 1;

            // Get the b64encoded string
            let vortexStr = data.substr(0, payloadSeparatorIndex);

            // Create payload object from it
            let payload = Payload.fromVortexMsg(vortexStr);

            // Send to vortex
            self._vortex._receive(payload);

            data = self._http.responseText.substr(self._responseParseIndex);
            payloadSeparatorIndex = data.indexOf(".");
        }

        // In the event that the browser is buffering all this data, we should
        // reconnect to allow the browser to cleanup.
        if (self._http.responseText.length >= VortexConnection.RECONNECT_SIZE_LIMIT
            && !self._closing) {
            self._closing = true;
            self._vortex.reconnect();
        }

    }

    private _error(e) {
        let self = this;
        if (self._updateTimer)
            clearInterval(self._updateTimer);
        console.log("VortexConnection, connection errored out");
    }

}


// ###########################################################################

// ###########################################################################