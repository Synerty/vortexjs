"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var VortexClientABC_1 = require("./VortexClientABC");
var UtilMisc_1 = require("./UtilMisc");
var PayloadEnvelope_1 = require("./PayloadEnvelope");
var VortexClientWebsocket = /** @class */ (function (_super) {
    __extends(VortexClientWebsocket, _super);
    function VortexClientWebsocket(vortexStatusService, url, vortexClientName) {
        var _this = _super.call(this, vortexStatusService, url, vortexClientName) || this;
        _this.Socket = WebSocket || MozWebSocket;
        _this.socket = null;
        _this.lastReconnectDate = Date.parse("01-Jan-2017");
        _this.unsentBuffer = [];
        return _this;
    }
    Object.defineProperty(VortexClientWebsocket.prototype, "isReady", {
        get: function () {
            return this.socket != null && this.socket.readyState === this.Socket.OPEN;
        },
        enumerable: true,
        configurable: true
    });
    // OVERRIDE Send
    VortexClientWebsocket.prototype.send = function (payloadEnvelope) {
        if (!this.isReady) {
            throw new Error("Websocked vortex is not online.");
        }
        return _super.prototype.send.call(this, payloadEnvelope);
    };
    // OVERRIDE reconnect
    VortexClientWebsocket.prototype.reconnect = function () {
        if (this.closed)
            throw new Error("An attempt was made to reconnect a closed vortex");
        this.restartTimer();
        this.createSocket();
    };
    VortexClientWebsocket.prototype.sendVortexMsg = function (vortexMsgs) {
        this.unsentBuffer.add(vortexMsgs);
        this.sendMessages();
    };
    VortexClientWebsocket.prototype.sendMessages = function () {
        while (this.unsentBuffer.length !== 0) {
            if (!this.isReady)
                return;
            var vortexMsg = this.unsentBuffer.shift();
            this.socket.send(vortexMsg + '.');
        }
    };
    VortexClientWebsocket.prototype.shutdown = function () {
        this.createSocket();
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
        var _this = this;
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
        PayloadEnvelope_1.PayloadEnvelope.fromVortexMsg(event.data)
            .then(function (pe) { return _this.receive(pe); })
            .catch(function (e) { return console.log("ERROR VortexClientWebsocket: " + e); });
    };
    VortexClientWebsocket.prototype.onOpen = function (event) {
        var _this = this;
        var readyCount = 0;
        var check = function () {
            if (_this.isReady) {
                readyCount++;
            }
            if (readyCount >= 4) {
                _this.vortexStatusService.setOnline(true);
                _this.sendMessages();
                return;
            }
            setTimeout(check, 50);
        };
        check();
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
    VortexClientWebsocket.RECONNECT_BACKOFF = 5000; // milliseconds
    return VortexClientWebsocket;
}(VortexClientABC_1.VortexClientABC));
exports.VortexClientWebsocket = VortexClientWebsocket;
//# sourceMappingURL=/Users/jchesney/dev-peek-util/vortexjs/src/vortex/VortexClientWebsocket.js.map