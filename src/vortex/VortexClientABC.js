"use strict";
var Payload_1 = require("./Payload");
var UtilMisc_1 = require("./UtilMisc");
var PayloadFilterKeys_1 = require("./PayloadFilterKeys");
var PayloadIO_1 = require("./PayloadIO");
/**
 * Server response timeout in milliseconds
 * @type {number}
 */
exports.SERVER_RESPONSE_TIMEOUT = 20000;
var VortexClientABC = (function () {
    /**
     * RapUI VortexService, This class is responsible for sending and receiving payloads to/from
     * the server.
     */
    function VortexClientABC(vortexStatusService, zone, url) {
        this.vortexStatusService = vortexStatusService;
        this.zone = zone;
        this.beatTimer = null;
        this.serverVortexUuid = null;
        this.serverVortexName = null;
        this._uuid = this._makeUuid();
        this._name = "browser";
        this._url = url;
        this._vortexClosed = false;
    }
    VortexClientABC.prototype._makeUuid = function () {
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
        },
        enumerable: true,
        configurable: true
    });
    VortexClientABC.prototype.send = function (payload) {
        var self = this;
        if (self.closed) {
            console.log(UtilMisc_1.dateStr() + "VortexService is closed, Probably due to a login page reload");
            return;
        }
        var payloads = [];
        if (payload instanceof Array)
            payloads = payload;
        else
            payloads = [payload];
        for (var _i = 0, payloads_1 = payloads; _i < payloads_1.length; _i++) {
            var p = payloads_1[_i];
            // Empty payloads are like heart beats, don't check them
            if (!p.isEmpty() && p.filt["key"] == null) {
                throw new Error("There is no 'key' in the payload filt"
                    + ", There must be one for routing");
            }
        }
        this.sendPayloads(payloads);
    };
    VortexClientABC.prototype.reconnect = function () {
        this.restartTimer();
        this.send(new Payload_1.Payload());
    };
    VortexClientABC.prototype.beat = function () {
        this.vortexStatusService.setOnline(true);
        this.restartTimer();
    };
    VortexClientABC.prototype.restartTimer = function () {
        var _this = this;
        if (this.beatTimer != null)
            clearInterval(this.beatTimer);
        this.beatTimer = setInterval(function () {
            _this.dead();
            _this.reconnect();
        }, 15000);
    };
    VortexClientABC.prototype.dead = function () {
        this.vortexStatusService.setOnline(false);
        this.vortexStatusService.logInfo("VortexService server heartbeats have timed out");
    };
    /**
     * Receive
     * This should only be called only from VortexConnection
     * @param payload {Payload}
     */
    VortexClientABC.prototype.receive = function (payload) {
        this.beat();
        if (payload.filt.hasOwnProperty(PayloadFilterKeys_1.rapuiClientEcho)) {
            delete payload[PayloadFilterKeys_1.rapuiClientEcho];
            this.send(payload);
        }
        if (payload.isEmpty()) {
            if (payload.filt[Payload_1.Payload.vortexUuidKey] != null)
                this.serverVortexUuid = payload.filt[Payload_1.Payload.vortexUuidKey];
            if (payload.filt[Payload_1.Payload.vortexNameKey] != null)
                this.serverVortexName = payload.filt[Payload_1.Payload.vortexNameKey];
            return;
        }
        // console.log(dateStr() + "Received payload with filt : " + JSON.stringify(payload.filt));
        // TODO, Tell the payloadIO the vortexUuid
        this.zone.run(function () {
            PayloadIO_1.payloadIO.process(payload);
        });
    };
    return VortexClientABC;
}());
exports.VortexClientABC = VortexClientABC;
//# sourceMappingURL=/home/peek/project/vortexjs/src/vortex/VortexClientABC.js.map