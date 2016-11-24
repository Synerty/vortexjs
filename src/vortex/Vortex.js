"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Payload_1 = require("./Payload");
var PayloadIO_1 = require("./PayloadIO");
var PayloadFilterKeys_1 = require("./PayloadFilterKeys");
var UtilMisc_1 = require("./UtilMisc");
var core_1 = require("@angular/core");
var PayloadEndpoint_1 = require("./PayloadEndpoint");
var TupleLoader_1 = require("./TupleLoader");
/**
 * Server response timeout in milliseconds
 * @type {number}
 */
exports.SERVER_RESPONSE_TIMEOUT = 20000;
var VortexService = (function () {
    function VortexService(balloonMsg) {
        this.balloonMsg = balloonMsg;
        var self = this;
        self.vortex = new Vortex();
    }
    VortexService.prototype.reconnect = function () {
        this.vortex.reconnect();
    };
    VortexService.prototype.sendTuple = function (filt, tuples) {
        var self = this;
        if (typeof filt === "string") {
            filt = { key: filt };
        }
        self.sendPayload(new Payload_1.Payload(filt, tuples));
    };
    VortexService.prototype.sendFilt = function (filt) {
        var self = this;
        this.sendPayload(new Payload_1.Payload(filt));
    };
    VortexService.prototype.sendPayload = function (payload) {
        var self = this;
        self.vortex.send(payload);
    };
    VortexService.prototype.createEndpointObservable = function (component, filter, processLatestOnly) {
        if (processLatestOnly === void 0) { processLatestOnly = false; }
        var endpoint = new PayloadEndpoint_1.PayloadEndpoint(component, filter, processLatestOnly);
        return this.createEndpoint(component, filter, processLatestOnly).observable;
    };
    VortexService.prototype.createEndpoint = function (component, filter, processLatestOnly) {
        if (processLatestOnly === void 0) { processLatestOnly = false; }
        return new PayloadEndpoint_1.PayloadEndpoint(component, filter, processLatestOnly);
    };
    VortexService.prototype.createTupleLoader = function (component, filterUpdateCallable) {
        return new TupleLoader_1.TupleLoader(this.vortex, component, filterUpdateCallable, this.balloonMsg);
    };
    VortexService = __decorate([
        core_1.Injectable()
    ], VortexService);
    return VortexService;
}());
exports.VortexService = VortexService;
var Vortex = (function () {
    /**
     * RapUI VortexService, This class is responsible for sending and receiving payloads to/from
     * the server.
     */
    function Vortex() {
        var self = this;
        self._buffer = null;
        self._beatTimer = null;
        self._uuid = self._makeUuid();
        self._vortexClosed = false;
        self.serverVortexUuid = null;
        self.reconnect();
    }
    Vortex.prototype._makeUuid = function () {
        function func(c) {
            var r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, func);
    };
    Object.defineProperty(Vortex.prototype, "uuid", {
        get: function () {
            var self = this;
            return self._uuid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vortex.prototype, "closed", {
        get: function () {
            return this._vortexClosed;
        },
        set: function (value) {
            this._vortexClosed = value;
        },
        enumerable: true,
        configurable: true
    });
    Vortex.prototype.send = function (payload) {
        var self = this;
        if (self._vortexClosed) {
            console.log(UtilMisc_1.dateStr() + "VortexService is closed, Probably due to a login page reload");
            return;
        }
        // Empty payloads are like heart beats, don't check them
        if (!payload.isEmpty() && payload.filt["key"] == null) {
            throw new Error("There is no 'key' in the payload filt"
                + ", There must be one for routing");
        }
        var conn = new VortexConnection(self);
        conn.send(payload);
        // console.log(dateStr() + "Sent payload with filt : " + JSON.stringify(payload.filt));
    };
    Vortex.prototype.reconnect = function () {
        var self = this;
        self.send(new Payload_1.Payload());
    };
    Vortex.prototype._beat = function () {
        var self = this;
        // console.log(dateStr() + 'VortexService beating');
        if (self._beatTimer != null)
            clearInterval(self._beatTimer);
        self._beatTimer = setInterval(function () {
            self._dead();
            self.reconnect();
        }, 15000);
    };
    Vortex.prototype._dead = function () {
        var self = this;
        console.log(UtilMisc_1.dateStr() + "VortexService server heartbeats have timed out");
    };
    /**
     * Receive
     * This should only be called only from VortexConnection
     * @param payload {Payload}
     * @private
     */
    Vortex.prototype._receive = function (payload) {
        var self = this;
        self._beat();
        if (payload.filt.hasOwnProperty(PayloadFilterKeys_1.rapuiClientEcho)) {
            delete payload[PayloadFilterKeys_1.rapuiClientEcho];
            self.send(payload);
        }
        if (payload.isEmpty()) {
            if (payload.filt[Payload_1.Payload.vortexUuidKey] != null)
                self.serverVortexUuid = payload.filt[Payload_1.Payload.vortexUuidKey];
            return;
        }
        console.log(UtilMisc_1.dateStr() + "Received payload with filt : " + JSON.stringify(payload.filt));
        // TODO, Tell the payloadIO the vortexUuid
        PayloadIO_1.payloadIO.process(payload);
    };
    return Vortex;
}());
exports.Vortex = Vortex;
// ############################################################################
var VortexConnection = (function () {
    function VortexConnection(vortex) {
        var self = this;
        self._vortex = vortex;
        var randArg = Math.random() + "." + (new Date()).getTime();
        var args = {
            "vortexUuid": vortex.uuid,
            "__randArg__": randArg
        };
        self._http = new XMLHttpRequest();
        self._http.open("POST", "/vortex" + UtilMisc_1.getFiltStr(args), true);
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
        self._http.onabort = UtilMisc_1.bind(self, self._error);
        self._http.onerror = UtilMisc_1.bind(self, self._error);
        self._http.ontimeout = UtilMisc_1.bind(self, self._error);
        self._responseParseIndex = 0;
        self._closing = false;
        self._aborting = false;
    }
    VortexConnection.prototype.send = function (payloads) {
        var self = this;
        if (!(payloads instanceof Array))
            payloads = [payloads];
        var data = "";
        for (var i = 0; i < payloads.length; i++) {
            var payload = payloads[i];
            // Serialise the payload
            data += payload.toVortexMsg() + ".";
        }
        // console.log("sending payload");
        // console.log(xmlStr);
        self._http.send(data);
    };
    VortexConnection.prototype._received = function () {
        var self = this;
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
        var data = self._http.responseText.substr(self._responseParseIndex);
        var payloadSeparatorIndex = data.indexOf(".");
        while (payloadSeparatorIndex !== -1) {
            self._responseParseIndex += payloadSeparatorIndex + 1;
            // Get the b64encoded string
            var vortexStr = data.substr(0, payloadSeparatorIndex);
            // Create payload object from it
            var payload = Payload_1.Payload.fromVortexMsg(vortexStr);
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
    };
    VortexConnection.prototype._error = function (e) {
        var self = this;
        if (self._updateTimer)
            clearInterval(self._updateTimer);
        console.log("VortexConnection, connection errored out");
    };
    VortexConnection.RECONNECT_SIZE_LIMIT = 20 * 1024 * 1024; // 20 megabytes
    return VortexConnection;
}());
