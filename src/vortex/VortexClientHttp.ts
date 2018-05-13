import {bind, getFiltStr} from "./UtilMisc";
import {VortexClientABC} from "./VortexClientABC";
import {VortexStatusService} from "./VortexStatusService";
import {PayloadEnvelope} from "./PayloadEnvelope";


interface ReceivePayloadCallable {
    (Payload): void;
}

interface VortexBeatCallable {
    (): void;
}


export class VortexClientHttp extends VortexClientABC {

    /**
     * RapUI VortexService, This class is responsible for sending and receiving payloads to/from
     * the server.
     */
    private lastConn: _VortexClientHttpConnection | null = null;

    constructor(vortexStatusService: VortexStatusService,
                url: string,
                vortexClientName: string) {
        super(vortexStatusService, url, vortexClientName);

    }


    protected shutdown(): void {
        if (this.lastConn) {
            this.lastConn.shutdown();
            this.lastConn = null;
        }
    }


    protected sendVortexMsg(vortexMsgs: string[]): void {
        this.lastConn = new _VortexClientHttpConnection(this, this.vortexStatusService,
            (payload) => this.receive(payload),
            () => this.beat()
        );
        this.lastConn.send(vortexMsgs);
        // console.log(dateStr() + "Sent payload with filt : " + JSON.stringify(payload.filt));
    }


}

// ############################################################################
class _VortexClientHttpConnection {


    private static readonly RECONNECT_SIZE_LIMIT = 20 * 1024 * 1024; // 20 megabytes

    private _vortex: VortexClientHttp;
    private _http: XMLHttpRequest;
    private _updateTimer: any;
    private _responseParseIndex: number;
    private _closing: boolean;
    private _aborting: boolean;


    constructor(private vortex: VortexClientHttp,
                private vortexStatusService: VortexStatusService,
                private receiveCallback: ReceivePayloadCallable,
                private vortexBeatCallback: VortexBeatCallable) {
        let self = this;

        let randArg = Math.random() + "." + (new Date()).getTime();
        let args = {
            "vortexUuid": vortex.uuid,
            "vortexName": vortex.name,
            "__randArg__": randArg
        };

        self._http = new XMLHttpRequest();
        self._http.open("POST", self.vortex.url + getFiltStr(args), true);

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

    shutdown(): void {
        this._closing = true;
        if (this._http)
            this._http.abort();
    }

    send(vortexMsgs: string[]) {
        let data = "";

        for (let vortexMsg of vortexMsgs) {
            // Serialise the payload
            data += vortexMsg + ".";
        }

        // console.log("sending payload");
        // console.log(xmlStr);
        this._http.send(data);
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

            self.vortex.closed = true;
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

            if (vortexStr.length === 0) {
                self.vortexBeatCallback();

            } else {
                // Create payload object from it
                // Send to vortex
                PayloadEnvelope.fromVortexMsg(vortexStr)
                    .then((pe: PayloadEnvelope) => self.receiveCallback(pe))
                    .catch(e => console.log(`An error occured deserialising ${e}`));
            }

            data = self._http.responseText.substr(self._responseParseIndex);
            payloadSeparatorIndex = data.indexOf(".");
        }

        // In the event that the browser is buffering all this data, we should
        // reconnect to allow the browser to cleanup.
        if (self._http.responseText.length >= _VortexClientHttpConnection.RECONNECT_SIZE_LIMIT
            && !self._closing) {
            self._closing = true;
            self.vortex.reconnect();
        }

    }

    private _error(e) {
        let self = this;
        if (self._updateTimer)
            clearInterval(self._updateTimer);

        if (self._aborting || this._closing)
            return;

        let msg = "";

        if (e.type === 'abort') {
            msg = "Request was aborted and not by VortexJS";

        } else {
            try {
                msg = e.toString();
            } catch (e) {
            }

        }

        this.vortexStatusService.setOnline(false);
        this.vortexStatusService.logError(msg);

        // console.log("VortexConnection, connection errored out: " + msg);
    }

}
