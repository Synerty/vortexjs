"use strict";
var Payload_1 = require("./Payload");
var PayloadIO_1 = require("./PayloadIO");
var PayloadFiterKeys_1 = require("./PayloadFiterKeys");
var _1_Util_1 = require("../js_util/1_Util");
/**
 * Server response timeout in milliseconds
 * @type {number}
 */
exports.SERVER_RESPONSE_TIMEOUT = 20000;
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
    Vortex.prototype.uuid = function () {
        var self = this;
        return self._uuid;
    };
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
        if (payload === void 0) { payload = null; }
        var self = this;
        if (self._vortexClosed) {
            console.log(dateStr() + "VortexService is closed, Probably due to a login page reload");
            return;
        }
        if (payload == null) {
            payload = new Payload_1.default();
        }
        else if (payload.filt["key"] == null) {
            throw new Error("There is no 'key' in the payload filt"
                + ", There must be one for routing");
        }
        var conn = new VortexConnection(self);
        conn.send(payload);
        console.log(dateStr() + "Sent payload with filt : " + JSON.stringify(payload.filt));
    };
    Vortex.prototype.reconnect = function () {
        var self = this;
        self.send();
    };
    Vortex.prototype._beat = function () {
        var self = this;
        // console.log(dateStr() + 'VortexService beating');
        if (self._beatTimer != null)
            clearInterval(self._beatTimer);
        self._beatTimer = setInterval(function () {
            self._dead();
        }, 10000);
    };
    Vortex.prototype._dead = function () {
        var self = this;
        console.log(dateStr() + "VortexService dead");
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
        if (payload.filt.hasOwnProperty(PayloadFiterKeys_1.rapuiClientEcho)) {
            delete payload[PayloadFiterKeys_1.rapuiClientEcho];
            self.send(payload);
        }
        if (payload.isEmpty()) {
            if (payload.filt[Payload_1.default.vortexUuidKey] != null)
                self.serverVortexUuid = payload.filt[Payload_1.default.vortexUuidKey];
            return;
        }
        console.log(dateStr() + "Received payload with filt : " + JSON.stringify(payload.filt));
        // TODO, Tell the payloadIO the vortexUuid
        PayloadIO_1.default.process(payload);
    };
    return Vortex;
}());
// ############################################################################
var VortexConnection = (function () {
    function VortexConnection(vortex) {
        var self = this;
        self._vortex = vortex;
        var randArg = Math.random() + "." + (new Date()).getTime();
        var args = {
            "vortexUuid": vortex._uuid,
            "__randArg__": randArg
        };
        self._http = new XMLHttpRequest();
        self._http.open("POST", "/vortex" + _1_Util_1.getFiltStr(args), true);
        // State event
        self._http.onreadystatechange = function (e) {
            self._stateChange(e);
        };
        self._updateTimer = null;
        // Good events
        self._http.onloadstart = function (e) {
            self._received();
            self._updateTimer = setInterval(function () {
                self._received();
            }, 100);
        };
        self._http.onprogress = function (e) {
            self._received();
        };
        self._http.onload = function (e) {
            if (self._updateTimer)
                clearInterval(self._updateTimer);
            self._received();
        };
        // self._http.onloadend = function(e){self._received(e)};
        // Bad events
        self._http.onabort = function (e) {
            self._error(e);
        };
        self._http.onerror = function (e) {
            self._error(e);
        };
        self._http.ontimeout = function (e) {
            self._error(e);
        };
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
        // let len = self._http.responseText.length - self._responseParseIndex;
        // console.log("VortexConnection, data recieved, len=" + len);
        // If we receive something that is not valid vortex data, then reload the page
        if ((/^</).test(self._http.responseText)) {
            self._vortex.closed = true;
            self._closing = true;
            self._aborting = true;
            self._http.abort();
            location.reload();
            return;
        }
        var data = self._http.responseText.substr(self._responseParseIndex);
        var payloadSeparatorIndex = data.indexOf(".");
        while (payloadSeparatorIndex !== -1) {
            self._responseParseIndex += payloadSeparatorIndex + 1;
            // Get the b64encoded string
            var vortexStr = data.substr(0, payloadSeparatorIndex);
            // Create payload object from it
            var payload = Payload_1.default.fromVortexMsg(vortexStr);
            // Send to vortex
            self._vortex._receive(payload);
            data = self._http.responseText.substr(self._responseParseIndex);
            payloadSeparatorIndex = data.indexOf(".");
        }
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
    VortexConnection.prototype._stateChange = function (e) {
        var self = this;
        // Apparently self is depreciated or something
        // console.log("VortexConnection, state has changed to " +
        // self._http.readyState);
    };
    VortexConnection.RECONNECT_SIZE_LIMIT = 20 * 1024 * 1024; // 10 megabytes
    return VortexConnection;
}());
// ###########################################################################
exports.vortex = new Vortex();
// ----------------------------------------------------------------------------
function dateStr() {
    var d = new Date();
    return d.toTimeString().split(" ")[0] + "." + d.getUTCMilliseconds() + ": ";
}
// ----------------------------------------------------------------------------
function vortexSendTuple(filt, tuple_) {
    var payload = new Payload_1.default();
    if (typeof filt === "string") {
        payload.filt["key"] = filt;
    }
    if (Object.prototype.toString.call(tuple_) === "[object Array]") {
        payload.tuples = tuple_;
    }
    else if (tuple_ != null) {
        payload.tuples.push(tuple_);
    }
    vortexSendPayload(payload);
}
exports.vortexSendTuple = vortexSendTuple;
function vortexSendFilt(filt) {
    vortexSendPayload(new Payload_1.default(filt));
}
exports.vortexSendFilt = vortexSendFilt;
function vortexSendPayload(payload) {
    exports.vortex.send(payload);
}
exports.vortexSendPayload = vortexSendPayload;
// ########################################################################### 
