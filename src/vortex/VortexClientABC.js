"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        this._uuid = VortexClientABC.makeUuid();
        this._name = "browser";
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
    VortexClientABC.prototype.send = function (payload) {
        var _this = this;
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
        var vortexMsgs = [];
        var promisies = [];
        for (var _a = 0, payloads_2 = payloads; _a < payloads_2.length; _a++) {
            var payload_1 = payloads_2[_a];
            promisies.push(payload_1.toVortexMsg()
                .then(function (vortexMsg) { return vortexMsgs.push(vortexMsg); }));
        }
        Promise.all(promisies)
            .then(function () { return _this.sendVortexMsg(vortexMsgs); })
            .catch(function (e) { return console.log("ERROR VortexClientABC: " + e.toString()); });
    };
    VortexClientABC.prototype.reconnect = function () {
        if (this.closed)
            throw new Error("An attempt was made to reconnect a closed vortex");
        this.restartTimer();
        this.send(new Payload_1.Payload());
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVm9ydGV4Q2xpZW50QUJDLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiVm9ydGV4Q2xpZW50QUJDLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQWtDO0FBQ2xDLHVDQUFtQztBQUNuQyx5REFBb0Q7QUFDcEQseUNBQXNDO0FBS3RDOzs7R0FHRztBQUNRLFFBQUEsdUJBQXVCLEdBQUcsS0FBSyxDQUFDO0FBRTNDO0lBV0k7OztPQUdHO0lBQ0gseUJBQXNCLG1CQUF3QyxFQUMxQyxJQUFZLEVBQ3BCLEdBQVc7UUFGRCx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQzFDLFNBQUksR0FBSixJQUFJLENBQVE7UUFkeEIsY0FBUyxHQUFlLElBQUksQ0FBQztRQU03QixxQkFBZ0IsR0FBa0IsSUFBSSxDQUFDO1FBQ3ZDLHFCQUFnQixHQUFrQixJQUFJLENBQUM7UUFTM0MsSUFBSSxDQUFDLEtBQUssR0FBRyxlQUFlLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDeEMsSUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7UUFDdkIsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7UUFDaEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7SUFDL0IsQ0FBQztJQUVNLHdCQUFRLEdBQWY7UUFDSSxjQUFjLENBQUM7WUFDWCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQ3BFLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzFCLENBQUM7UUFFRCxNQUFNLENBQUMsc0NBQXNDLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRUQsc0JB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O1lBQy9DLE9BQU8sT0FBTyxDQUFDLG1DQUFlLENBQUMsQ0FBQztZQUNoQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZCLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsaUJBQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxJQUFJLENBQUM7Z0JBQzVDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLGlCQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFaEUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxpQkFBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLElBQUksQ0FBQztnQkFDNUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsaUJBQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUVoRSxNQUFNLENBQUM7UUFDWCxDQUFDO1FBRUQsMkZBQTJGO1FBRTNGLDBDQUEwQztRQUMxQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztZQUNWLHFCQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQy9CLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUdMLHNCQUFDO0FBQUQsQ0FBQyxBQTVLRCxJQTRLQztBQTVLcUIsMENBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1BheWxvYWR9IGZyb20gXCIuL1BheWxvYWRcIjtcbmltcG9ydCB7ZGF0ZVN0cn0gZnJvbSBcIi4vVXRpbE1pc2NcIjtcbmltcG9ydCB7cmFwdWlDbGllbnRFY2hvfSBmcm9tIFwiLi9QYXlsb2FkRmlsdGVyS2V5c1wiO1xuaW1wb3J0IHtwYXlsb2FkSU99IGZyb20gXCIuL1BheWxvYWRJT1wiO1xuaW1wb3J0IHtOZ1pvbmV9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQge1ZvcnRleFN0YXR1c1NlcnZpY2V9IGZyb20gXCIuL1ZvcnRleFN0YXR1c1NlcnZpY2VcIjtcblxuXG4vKipcbiAqIFNlcnZlciByZXNwb25zZSB0aW1lb3V0IGluIG1pbGxpc2Vjb25kc1xuICogQHR5cGUge251bWJlcn1cbiAqL1xuZXhwb3J0IGxldCBTRVJWRVJfUkVTUE9OU0VfVElNRU9VVCA9IDIwMDAwO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVm9ydGV4Q2xpZW50QUJDIHtcblxuICAgIHByaXZhdGUgYmVhdFRpbWVyOiBhbnkgfCBudWxsID0gbnVsbDtcbiAgICBwcml2YXRlIF91dWlkOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfbmFtZTogc3RyaW5nO1xuICAgIHByaXZhdGUgX3VybDogc3RyaW5nO1xuICAgIHByaXZhdGUgX3ZvcnRleENsb3NlZDogYm9vbGVhbjtcblxuICAgIHByaXZhdGUgc2VydmVyVm9ydGV4VXVpZDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gICAgcHJpdmF0ZSBzZXJ2ZXJWb3J0ZXhOYW1lOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFJhcFVJIFZvcnRleFNlcnZpY2UsIFRoaXMgY2xhc3MgaXMgcmVzcG9uc2libGUgZm9yIHNlbmRpbmcgYW5kIHJlY2VpdmluZyBwYXlsb2FkcyB0by9mcm9tXG4gICAgICogdGhlIHNlcnZlci5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgdm9ydGV4U3RhdHVzU2VydmljZTogVm9ydGV4U3RhdHVzU2VydmljZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIHpvbmU6IE5nWm9uZSxcbiAgICAgICAgICAgICAgICB1cmw6IHN0cmluZykge1xuICAgICAgICB0aGlzLl91dWlkID0gVm9ydGV4Q2xpZW50QUJDLm1ha2VVdWlkKCk7XG4gICAgICAgIHRoaXMuX25hbWUgPSBcImJyb3dzZXJcIjtcbiAgICAgICAgdGhpcy5fdXJsID0gdXJsO1xuICAgICAgICB0aGlzLl92b3J0ZXhDbG9zZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBzdGF0aWMgbWFrZVV1aWQoKSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bmMoYykge1xuICAgICAgICAgICAgbGV0IHIgPSBNYXRoLnJhbmRvbSgpICogMTYgfCAwLCB2ID0gYyA9PT0gXCJ4XCIgPyByIDogKHIgJiAweDMgfCAweDgpO1xuICAgICAgICAgICAgcmV0dXJuIHYudG9TdHJpbmcoMTYpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFwieHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4XCIucmVwbGFjZSgvW3h5XS9nLCBmdW5jKTtcbiAgICB9XG5cbiAgICBnZXQgdXJsKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl91cmw7XG4gICAgfVxuXG4gICAgZ2V0IHV1aWQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3V1aWQ7XG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gICAgfVxuXG4gICAgZ2V0IGNsb3NlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZvcnRleENsb3NlZDtcbiAgICB9XG5cbiAgICBzZXQgY2xvc2VkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX3ZvcnRleENsb3NlZCA9IHZhbHVlO1xuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJCZWF0VGltZXIoKTtcbiAgICAgICAgICAgIHRoaXMuc2h1dGRvd24oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNlbmQocGF5bG9hZDogUGF5bG9hZCB8IFBheWxvYWRbXSk6IHZvaWQge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmIChzZWxmLmNsb3NlZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZGF0ZVN0cigpICsgXCJWb3J0ZXhTZXJ2aWNlIGlzIGNsb3NlZCwgUHJvYmFibHkgZHVlIHRvIGEgbG9naW4gcGFnZSByZWxvYWRcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcGF5bG9hZHM6IFBheWxvYWRbXSA9IFtdO1xuICAgICAgICBpZiAocGF5bG9hZCBpbnN0YW5jZW9mIEFycmF5KVxuICAgICAgICAgICAgcGF5bG9hZHMgPSBwYXlsb2FkO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBwYXlsb2FkcyA9IFtwYXlsb2FkXTtcblxuICAgICAgICBmb3IgKGxldCBwIG9mIHBheWxvYWRzKSB7XG4gICAgICAgICAgICAvLyBFbXB0eSBwYXlsb2FkcyBhcmUgbGlrZSBoZWFydCBiZWF0cywgZG9uJ3QgY2hlY2sgdGhlbVxuICAgICAgICAgICAgaWYgKCFwLmlzRW1wdHkoKSAmJiBwLmZpbHRbXCJrZXlcIl0gPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZXJlIGlzIG5vICdrZXknIGluIHRoZSBwYXlsb2FkIGZpbHRcIlxuICAgICAgICAgICAgICAgICAgICArIFwiLCBUaGVyZSBtdXN0IGJlIG9uZSBmb3Igcm91dGluZ1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB2b3J0ZXhNc2dzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICBsZXQgcHJvbWlzaWVzID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgcGF5bG9hZCBvZiBwYXlsb2Fkcykge1xuICAgICAgICAgICAgcHJvbWlzaWVzLnB1c2goXG4gICAgICAgICAgICAgICAgcGF5bG9hZC50b1ZvcnRleE1zZygpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKCh2b3J0ZXhNc2cpID0+IHZvcnRleE1zZ3MucHVzaCh2b3J0ZXhNc2cpKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIFByb21pc2UuYWxsKHByb21pc2llcylcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMuc2VuZFZvcnRleE1zZyh2b3J0ZXhNc2dzKSlcbiAgICAgICAgICAgIC5jYXRjaChlID0+IGNvbnNvbGUubG9nKGBFUlJPUiBWb3J0ZXhDbGllbnRBQkM6ICR7ZS50b1N0cmluZygpfWApKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3Qgc2VuZFZvcnRleE1zZyh2b3J0ZXhNc2dzOiBzdHJpbmdbXSk6IHZvaWQ7XG5cbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3Qgc2h1dGRvd24oKTogdm9pZDtcblxuICAgIHJlY29ubmVjdCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuY2xvc2VkKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQW4gYXR0ZW1wdCB3YXMgbWFkZSB0byByZWNvbm5lY3QgYSBjbG9zZWQgdm9ydGV4XCIpO1xuXG4gICAgICAgIHRoaXMucmVzdGFydFRpbWVyKCk7XG4gICAgICAgIHRoaXMuc2VuZChuZXcgUGF5bG9hZCgpKTtcbiAgICB9XG5cblxuICAgIHByb3RlY3RlZCBiZWF0KCk6IHZvaWQge1xuICAgICAgICAvLyBXZSBtYXkgc3RpbGwgZ2V0IGEgYmVhdCBiZWZvcmUgdGhlIGNvbm5lY3Rpb24gY2xvc2VzXG4gICAgICAgIGlmICh0aGlzLmNsb3NlZClcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICB0aGlzLnZvcnRleFN0YXR1c1NlcnZpY2Uuc2V0T25saW5lKHRydWUpO1xuICAgICAgICB0aGlzLnJlc3RhcnRUaW1lcigpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVzdGFydFRpbWVyKCkge1xuICAgICAgICB0aGlzLmNsZWFyQmVhdFRpbWVyKCk7XG5cbiAgICAgICAgdGhpcy5iZWF0VGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5jbG9zZWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICB0aGlzLmRlYWQoKTtcbiAgICAgICAgICAgIHRoaXMucmVjb25uZWN0KCk7XG4gICAgICAgIH0sIDE1MDAwKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNsZWFyQmVhdFRpbWVyKCkge1xuICAgICAgICBpZiAodGhpcy5iZWF0VGltZXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmJlYXRUaW1lcik7XG4gICAgICAgICAgICB0aGlzLmJlYXRUaW1lciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGRlYWQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMudm9ydGV4U3RhdHVzU2VydmljZS5zZXRPbmxpbmUoZmFsc2UpO1xuICAgICAgICB0aGlzLnZvcnRleFN0YXR1c1NlcnZpY2UubG9nSW5mbyhcbiAgICAgICAgICAgIGBWb3J0ZXhTZXJ2aWNlIHNlcnZlciBoZWFydGJlYXRzIGhhdmUgdGltZWQgb3V0IDogJHt0aGlzLl91cmx9YFxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlY2VpdmVcbiAgICAgKiBUaGlzIHNob3VsZCBvbmx5IGJlIGNhbGxlZCBvbmx5IGZyb20gVm9ydGV4Q29ubmVjdGlvblxuICAgICAqIEBwYXJhbSBwYXlsb2FkIHtQYXlsb2FkfVxuICAgICAqL1xuICAgIHByb3RlY3RlZCByZWNlaXZlKHBheWxvYWQ6IFBheWxvYWQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5iZWF0KCk7XG4gICAgICAgIGlmIChwYXlsb2FkLmZpbHQuaGFzT3duUHJvcGVydHkocmFwdWlDbGllbnRFY2hvKSkge1xuICAgICAgICAgICAgZGVsZXRlIHBheWxvYWRbcmFwdWlDbGllbnRFY2hvXTtcbiAgICAgICAgICAgIHRoaXMuc2VuZChwYXlsb2FkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXlsb2FkLmlzRW1wdHkoKSkge1xuICAgICAgICAgICAgaWYgKHBheWxvYWQuZmlsdFtQYXlsb2FkLnZvcnRleFV1aWRLZXldICE9IG51bGwpXG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2ZXJWb3J0ZXhVdWlkID0gcGF5bG9hZC5maWx0W1BheWxvYWQudm9ydGV4VXVpZEtleV07XG5cbiAgICAgICAgICAgIGlmIChwYXlsb2FkLmZpbHRbUGF5bG9hZC52b3J0ZXhOYW1lS2V5XSAhPSBudWxsKVxuICAgICAgICAgICAgICAgIHRoaXMuc2VydmVyVm9ydGV4TmFtZSA9IHBheWxvYWQuZmlsdFtQYXlsb2FkLnZvcnRleE5hbWVLZXldO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjb25zb2xlLmxvZyhkYXRlU3RyKCkgKyBcIlJlY2VpdmVkIHBheWxvYWQgd2l0aCBmaWx0IDogXCIgKyBKU09OLnN0cmluZ2lmeShwYXlsb2FkLmZpbHQpKTtcblxuICAgICAgICAvLyBUT0RPLCBUZWxsIHRoZSBwYXlsb2FkSU8gdGhlIHZvcnRleFV1aWRcbiAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICBwYXlsb2FkSU8ucHJvY2VzcyhwYXlsb2FkKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbn1cbiJdfQ==