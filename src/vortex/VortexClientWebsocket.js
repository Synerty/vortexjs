"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Payload_1 = require("./Payload");
var VortexClientABC_1 = require("./VortexClientABC");
var UtilMisc_1 = require("./UtilMisc");
var VortexClientWebsocket = (function (_super) {
    __extends(VortexClientWebsocket, _super);
    function VortexClientWebsocket(vortexStatusService, zone, url) {
        var _this = _super.call(this, vortexStatusService, zone, url) || this;
        _this.Socket = WebSocket || MozWebSocket;
        _this.socket = null;
        _this.lastReconnectDate = Date.parse("01-Jan-2017");
        _this.unsentBuffer = [];
        _this.sentBuffer = [];
        return _this;
    }
    Object.defineProperty(VortexClientWebsocket.prototype, "isReady", {
        get: function () {
            return this.socket != null && this.socket.readyState === this.Socket.OPEN;
        },
        enumerable: true,
        configurable: true
    });
    VortexClientWebsocket.prototype.sendPayloads = function (payloads) {
        this.unsentBuffer.add(payloads);
        if (!this.isReady)
            this.createSocket();
        this.sendMessages();
    };
    VortexClientWebsocket.prototype.sendMessages = function () {
        while (this.unsentBuffer.length !== 0) {
            if (!this.isReady)
                return;
            var payload = this.unsentBuffer.shift();
            this.socket.send(payload.toVortexMsg());
        }
    };
    VortexClientWebsocket.prototype.createSocket = function () {
        var _this = this;
        // If we're already connecting, then do nothing
        if (this.socket && this.socket.readyState === this.Socket.CONNECTING)
            return;
        // If we're open then close
        if (this.socket && this.socket.readyState === this.Socket.OPEN)
            this.socket.close();
        this.socket = null;
        this.vortexStatusService.setOnline(false);
        // If the vortex is shutdown then don't reconnect
        if (this.closed) {
            this.vortexStatusService.logInfo("WebSocket, Vortex is shutdown");
            return;
        }
        // Don't continually reconnect
        var reconnectDiffMs = Date.now() - this.lastReconnectDate;
        if (reconnectDiffMs < VortexClientWebsocket.RECONNECT_BACKOFF) {
            setTimeout(function () { return _this.createSocket(); }, VortexClientWebsocket.RECONNECT_BACKOFF - reconnectDiffMs + 10);
            return;
        }
        this.lastReconnectDate = Date.now();
        // Prepare the args to send
        var args = {
            "vortexUuid": this.uuid,
            "vortexName": this.name
        };
        // Construct + open the socket
        this.vortexStatusService.logInfo("WebSocket, connecting to " + this.url);
        this.socket = new this.Socket(this.url + UtilMisc_1.getFiltStr(args), []);
        this.socket.binaryType = "arraybuffer";
        this.socket.addEventListener('open', function (event) { return _this.onOpen(event); });
        this.socket.addEventListener('message', function (event) { return _this.onMessage(event); });
        this.socket.addEventListener('close', function (event) { return _this.onClose(event); });
        this.socket.addEventListener('error', function (event) { return _this.onError(event); });
    };
    VortexClientWebsocket.prototype.onMessage = function (event) {
        if (event.data.length == null) {
            this.vortexStatusService.logError("WebSocket, We've received a websocket binary message," +
                " we expect a unicode");
            return;
        }
        // If the server sends us a '.', that's a heart beat, return it.
        if (event.data === '.') {
            this.beat();
            this.socket != null && this.socket.send('.');
            return;
        }
        var payload = Payload_1.Payload.fromVortexMsg(event.data);
        this.receive(payload);
    };
    VortexClientWebsocket.prototype.onOpen = function (event) {
        this.vortexStatusService.setOnline(true);
        this.sendMessages();
    };
    VortexClientWebsocket.prototype.onClose = function (event) {
        this.vortexStatusService.logInfo("WebSocket, closed");
        if (!(this.socket && this.socket.readyState === this.Socket.OPEN))
            this.vortexStatusService.setOnline(false);
        // The base class will reconnect
    };
    VortexClientWebsocket.prototype.onError = function (event) {
        this.vortexStatusService.logError(event.error ? event.error : "WebSocket, No error message");
        // onClose will get called as well
    };
    return VortexClientWebsocket;
}(VortexClientABC_1.VortexClientABC));
VortexClientWebsocket.RECONNECT_BACKOFF = 5000; // milliseconds
exports.VortexClientWebsocket = VortexClientWebsocket;
//# sourceMappingURL=/home/peek/project/vortexjs/src/vortex/VortexClientWebsocket.js.map