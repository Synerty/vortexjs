"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UtilMisc_1 = require("./UtilMisc");
var PayloadFilterKeys_1 = require("./PayloadFilterKeys");
var PayloadIO_1 = require("./PayloadIO");
var PayloadEnvelope_1 = require("./PayloadEnvelope");
/**
 * Server response timeout in milliseconds
 * @type {number}
 */
exports.SERVER_RESPONSE_TIMEOUT = 20000;
var VortexClientABC = /** @class */ (function () {
    /**
     * RapUI VortexService, This class is responsible for sending and receiving payloads to/from
     * the server.
     */
    function VortexClientABC(vortexStatusService, url, vortexClientName) {
        this.vortexStatusService = vortexStatusService;
        this.beatTimer = null;
        this.serverVortexUuid = null;
        this.serverVortexName = null;
        this._uuid = VortexClientABC.makeUuid();
        this._name = vortexClientName;
        this._url = url;
        this._vortexClosed = false;
    }
    VortexClientABC.makeUuid = function () {
        function func(c) {
            var r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, func);
    };
    Object.defineProperty(VortexClientABC.prototype, "url", {
        get: function () {
            return this._url;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VortexClientABC.prototype, "uuid", {
        get: function () {
            return this._uuid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VortexClientABC.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VortexClientABC.prototype, "closed", {
        get: function () {
            return this._vortexClosed;
        },
        set: function (value) {
            this._vortexClosed = value;
            if (value) {
                this.clearBeatTimer();
                this.shutdown();
            }
        },
        enumerable: true,
        configurable: true
    });
    VortexClientABC.prototype.send = function (payloadEnvelope) {
        var _this = this;
        if (this.closed) {
            var msg = UtilMisc_1.dateStr() + "VortexService is closed, Probably due to a login page reload";
            console.log(msg);
            throw new Error("An attempt was made to reconnect a closed vortex");
        }
        var payloadEnvelopes = [];
        if (payloadEnvelope instanceof Array)
            payloadEnvelopes = payloadEnvelope;
        else
            payloadEnvelopes = [payloadEnvelope];
        for (var _i = 0, payloadEnvelopes_1 = payloadEnvelopes; _i < payloadEnvelopes_1.length; _i++) {
            var p = payloadEnvelopes_1[_i];
            // Empty payloadEnvelopes are like heart beats, don't check them
            if (!p.isEmpty() && p.filt["key"] == null) {
                throw new Error("There is no 'key' in the payloadEnvelopes filt"
                    + ", There must be one for routing");
            }
        }
        var vortexMsgs = [];
        var promisies = [];
        for (var _a = 0, payloadEnvelopes_2 = payloadEnvelopes; _a < payloadEnvelopes_2.length; _a++) {
            var payloadEnvelope_1 = payloadEnvelopes_2[_a];
            promisies.push(payloadEnvelope_1.toVortexMsg()
                .then(function (vortexMsg) { return vortexMsgs.push(vortexMsg); }));
        }
        return Promise.all(promisies)
            .then(function () { return _this.sendVortexMsg(vortexMsgs); })
            .catch(function (e) {
            var msg = "ERROR VortexClientABC: " + e.toString();
            console.log(msg);
            throw new Error(msg);
        });
    };
    VortexClientABC.prototype.reconnect = function () {
        if (this.closed)
            throw new Error("An attempt was made to reconnect a closed vortex");
        this.restartTimer();
        this.send(new PayloadEnvelope_1.PayloadEnvelope());
    };
    VortexClientABC.prototype.beat = function () {
        // We may still get a beat before the connection closes
        if (this.closed)
            return;
        this.vortexStatusService.setOnline(true);
        this.restartTimer();
    };
    VortexClientABC.prototype.restartTimer = function () {
        var _this = this;
        this.clearBeatTimer();
        this.beatTimer = setInterval(function () {
            if (_this.closed)
                return;
            _this.dead();
            _this.reconnect();
        }, 15000);
    };
    VortexClientABC.prototype.clearBeatTimer = function () {
        if (this.beatTimer != null) {
            clearInterval(this.beatTimer);
            this.beatTimer = null;
        }
    };
    VortexClientABC.prototype.dead = function () {
        this.vortexStatusService.setOnline(false);
        this.vortexStatusService.logInfo("VortexService server heartbeats have timed out : " + this._url);
    };
    /**
     * Receive
     * This should only be called only from VortexConnection
     * @param payloadEnvelope {Payload}
     */
    VortexClientABC.prototype.receive = function (payloadEnvelope) {
        this.beat();
        if (payloadEnvelope.filt.hasOwnProperty(PayloadFilterKeys_1.rapuiClientEcho)) {
            delete payloadEnvelope[PayloadFilterKeys_1.rapuiClientEcho];
            this.send(payloadEnvelope);
        }
        if (payloadEnvelope.isEmpty()) {
            if (payloadEnvelope.filt[PayloadEnvelope_1.PayloadEnvelope.vortexUuidKey] != null)
                this.serverVortexUuid = payloadEnvelope.filt[PayloadEnvelope_1.PayloadEnvelope.vortexUuidKey];
            if (payloadEnvelope.filt[PayloadEnvelope_1.PayloadEnvelope.vortexNameKey] != null)
                this.serverVortexName = payloadEnvelope.filt[PayloadEnvelope_1.PayloadEnvelope.vortexNameKey];
            return;
        }
        // console.log(dateStr() + "Received payloadEnvelope with filt : " + JSON.stringify(payloadEnvelope.filt));
        // TODO, Tell the payloadIO the vortexUuid
        PayloadIO_1.payloadIO.process(payloadEnvelope);
    };
    return VortexClientABC;
}());
exports.VortexClientABC = VortexClientABC;
//# sourceMappingURL=/Users/jchesney/dev-peek-util/vortexjs/src/vortex/VortexClientABC.js.map