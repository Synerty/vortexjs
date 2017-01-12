"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Payload_1 = require("./Payload");
var UtilMisc_1 = require("./UtilMisc");
var VortexClientABC_1 = require("./VortexClientABC");
var VortexClientHttp = (function (_super) {
    __extends(VortexClientHttp, _super);
    /**
     * RapUI VortexService, This class is responsible for sending and receiving payloads to/from
     * the server.
     */
    function VortexClientHttp(vortexStatusService, zone, url) {
        return _super.call(this, vortexStatusService, zone, url) || this;
    }
    VortexClientHttp.prototype.sendPayloads = function (payloads) {
        var _this = this;
        var conn = new _VortexClientHttpConnection(this, function (payload) { return _this.receive(payload); });
        conn.send(payloads);
        // console.log(dateStr() + "Sent payload with filt : " + JSON.stringify(payload.filt));
    };
    return VortexClientHttp;
}(VortexClientABC_1.VortexClientABC));
exports.VortexClientHttp = VortexClientHttp;
// ############################################################################
var _VortexClientHttpConnection = (function () {
    function _VortexClientHttpConnection(vortex, receiveCallback) {
        this.vortex = vortex;
        this.receiveCallback = receiveCallback;
        var self = this;
        var randArg = Math.random() + "." + (new Date()).getTime();
        var args = {
            "vortexUuid": vortex.uuid,
            "vortexName": vortex.name,
            "__randArg__": randArg
        };
        self._http = new XMLHttpRequest();
        self._http.open("POST", self.vortex.url + UtilMisc_1.getFiltStr(args), true);
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
    _VortexClientHttpConnection.prototype.send = function (payloads) {
        var data = "";
        for (var _i = 0, payloads_1 = payloads; _i < payloads_1.length; _i++) {
            var payload = payloads_1[_i];
            // Serialise the payload
            data += payload.toVortexMsg() + ".";
        }
        // console.log("sending payload");
        // console.log(xmlStr);
        this._http.send(data);
    };
    _VortexClientHttpConnection.prototype._received = function () {
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
            self.vortex.closed = true;
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
            self.receiveCallback(payload);
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
    };
    _VortexClientHttpConnection.prototype._error = function (e) {
        var self = this;
        if (self._updateTimer)
            clearInterval(self._updateTimer);
        var msg = "";
        try {
            msg = e.toString();
        }
        catch (e) {
        }
        console.log("VortexConnection, connection errored out: " + msg);
    };
    return _VortexClientHttpConnection;
}());
_VortexClientHttpConnection.RECONNECT_SIZE_LIMIT = 20 * 1024 * 1024; // 20 megabytes
//# sourceMappingURL=VortexClientHttp.js.map