"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Payload_1 = require("./Payload");
var UtilMisc_1 = require("./UtilMisc");
var VortexClientABC_1 = require("./VortexClientABC");
var VortexClientHttp = (function (_super) {
    __extends(VortexClientHttp, _super);
    function VortexClientHttp(vortexStatusService, zone, url) {
        var _this = _super.call(this, vortexStatusService, zone, url) || this;
        /**
         * RapUI VortexService, This class is responsible for sending and receiving payloads to/from
         * the server.
         */
        _this.lastConn = null;
        return _this;
    }
    VortexClientHttp.prototype.shutdown = function () {
        if (this.lastConn) {
            this.lastConn.shutdown();
            this.lastConn = null;
        }
    };
    VortexClientHttp.prototype.sendVortexMsg = function (vortexMsgs) {
        var _this = this;
        this.lastConn = new _VortexClientHttpConnection(this, this.vortexStatusService, function (payload) { return _this.receive(payload); }, function () { return _this.beat(); });
        this.lastConn.send(vortexMsgs);
        // console.log(dateStr() + "Sent payload with filt : " + JSON.stringify(payload.filt));
    };
    return VortexClientHttp;
}(VortexClientABC_1.VortexClientABC));
exports.VortexClientHttp = VortexClientHttp;
// ############################################################################
var _VortexClientHttpConnection = (function () {
    function _VortexClientHttpConnection(vortex, vortexStatusService, receiveCallback, vortexBeatCallback) {
        this.vortex = vortex;
        this.vortexStatusService = vortexStatusService;
        this.receiveCallback = receiveCallback;
        this.vortexBeatCallback = vortexBeatCallback;
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
    _VortexClientHttpConnection.prototype.shutdown = function () {
        this._closing = true;
        if (this._http)
            this._http.abort();
    };
    _VortexClientHttpConnection.prototype.send = function (vortexMsgs) {
        var data = "";
        for (var _i = 0, vortexMsgs_1 = vortexMsgs; _i < vortexMsgs_1.length; _i++) {
            var vortexMsg = vortexMsgs_1[_i];
            // Serialise the payload
            data += vortexMsg + ".";
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
            if (vortexStr.length === 0) {
                self.vortexBeatCallback();
            }
            else {
                // Create payload object from it
                // Send to vortex
                Payload_1.Payload.fromVortexMsg(vortexStr)
                    .then(function (payload) { return self.receiveCallback(payload); })
                    .catch(function (e) { return console.log("An error occured deserialising " + e); });
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
    };
    _VortexClientHttpConnection.prototype._error = function (e) {
        var self = this;
        if (self._updateTimer)
            clearInterval(self._updateTimer);
        if (self._aborting || this._closing)
            return;
        var msg = "";
        if (e.type === 'abort') {
            msg = "Request was aborted and not by VortexJS";
        }
        else {
            try {
                msg = e.toString();
            }
            catch (e) {
            }
        }
        this.vortexStatusService.setOnline(false);
        this.vortexStatusService.logError(msg);
        // console.log("VortexConnection, connection errored out: " + msg);
    };
    _VortexClientHttpConnection.RECONNECT_SIZE_LIMIT = 20 * 1024 * 1024; // 20 megabytes
    return _VortexClientHttpConnection;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVm9ydGV4Q2xpZW50SHR0cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlZvcnRleENsaWVudEh0dHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBa0M7QUFDbEMsdUNBQTRDO0FBQzVDLHFEQUFrRDtBQWNsRDtJQUFzQyxvQ0FBZTtJQVFqRCwwQkFBWSxtQkFBd0MsRUFDeEMsSUFBWSxFQUNaLEdBQVc7UUFGdkIsWUFHSSxrQkFBTSxtQkFBbUIsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLFNBRXhDO1FBWEQ7OztXQUdHO1FBQ0ssY0FBUSxHQUF1QyxJQUFJLENBQUM7O0lBTzVELENBQUM7SUFHUyxtQ0FBUSxHQUFsQjtRQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDekIsQ0FBQztJQUNMLENBQUM7SUFHUyx3Q0FBYSxHQUF2QixVQUF3QixVQUFvQjtRQUE1QyxpQkFPQztRQU5HLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSwyQkFBMkIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixFQUMxRSxVQUFDLE9BQU8sSUFBSyxPQUFBLEtBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQXJCLENBQXFCLEVBQ2xDLGNBQU0sT0FBQSxLQUFJLENBQUMsSUFBSSxFQUFFLEVBQVgsQ0FBVyxDQUNwQixDQUFDO1FBQ0YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDL0IsdUZBQXVGO0lBQzNGLENBQUM7SUFHTCx1QkFBQztBQUFELENBQUMsQUFsQ0QsQ0FBc0MsaUNBQWUsR0FrQ3BEO0FBbENZLDRDQUFnQjtBQW9DN0IsK0VBQStFO0FBQy9FO0lBYUkscUNBQW9CLE1BQXdCLEVBQ3hCLG1CQUF3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SSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQ2hDLE1BQU0sQ0FBQztRQUVYLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUViLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNyQixHQUFHLEdBQUcseUNBQXlDLENBQUM7UUFFcEQsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osSUFBSSxDQUFDO2dCQUNELEdBQUcsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDdkIsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDYixDQUFDO1FBRUwsQ0FBQztRQUVELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDMUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUV2QyxtRUFBbUU7SUFDdkUsQ0FBQztJQXRLdUIsZ0RBQW9CLEdBQUcsRUFBRSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxlQUFlO0lBd0twRixrQ0FBQztDQUFBLEFBM0tELElBMktDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtQYXlsb2FkfSBmcm9tIFwiLi9QYXlsb2FkXCI7XG5pbXBvcnQge2JpbmQsIGdldEZpbHRTdHJ9IGZyb20gXCIuL1V0aWxNaXNjXCI7XG5pbXBvcnQge1ZvcnRleENsaWVudEFCQ30gZnJvbSBcIi4vVm9ydGV4Q2xpZW50QUJDXCI7XG5pbXBvcnQge05nWm9uZX0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7Vm9ydGV4U3RhdHVzU2VydmljZX0gZnJvbSBcIi4vVm9ydGV4U3RhdHVzU2VydmljZVwiO1xuXG5cbmludGVyZmFjZSBSZWNlaXZlUGF5bG9hZENhbGxhYmxlIHtcbiAgICAoUGF5bG9hZCk6IHZvaWQ7XG59XG5cbmludGVyZmFjZSBWb3J0ZXhCZWF0Q2FsbGFibGUge1xuICAgICgpOiB2b2lkO1xufVxuXG5cbmV4cG9ydCBjbGFzcyBWb3J0ZXhDbGllbnRIdHRwIGV4dGVuZHMgVm9ydGV4Q2xpZW50QUJDIHtcblxuICAgIC8qKlxuICAgICAqIFJhcFVJIFZvcnRleFNlcnZpY2UsIFRoaXMgY2xhc3MgaXMgcmVzcG9uc2libGUgZm9yIHNlbmRpbmcgYW5kIHJlY2VpdmluZyBwYXlsb2FkcyB0by9mcm9tXG4gICAgICogdGhlIHNlcnZlci5cbiAgICAgKi9cbiAgICBwcml2YXRlIGxhc3RDb25uOiBfVm9ydGV4Q2xpZW50SHR0cENvbm5lY3Rpb24gfCBudWxsID0gbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKHZvcnRleFN0YXR1c1NlcnZpY2U6IFZvcnRleFN0YXR1c1NlcnZpY2UsXG4gICAgICAgICAgICAgICAgem9uZTogTmdab25lLFxuICAgICAgICAgICAgICAgIHVybDogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKHZvcnRleFN0YXR1c1NlcnZpY2UsIHpvbmUsIHVybCk7XG5cbiAgICB9XG5cblxuICAgIHByb3RlY3RlZCBzaHV0ZG93bigpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMubGFzdENvbm4pIHtcbiAgICAgICAgICAgIHRoaXMubGFzdENvbm4uc2h1dGRvd24oKTtcbiAgICAgICAgICAgIHRoaXMubGFzdENvbm4gPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBwcm90ZWN0ZWQgc2VuZFZvcnRleE1zZyh2b3J0ZXhNc2dzOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgICAgICB0aGlzLmxhc3RDb25uID0gbmV3IF9Wb3J0ZXhDbGllbnRIdHRwQ29ubmVjdGlvbih0aGlzLCB0aGlzLnZvcnRleFN0YXR1c1NlcnZpY2UsXG4gICAgICAgICAgICAocGF5bG9hZCkgPT4gdGhpcy5yZWNlaXZlKHBheWxvYWQpLFxuICAgICAgICAgICAgKCkgPT4gdGhpcy5iZWF0KClcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5sYXN0Q29ubi5zZW5kKHZvcnRleE1zZ3MpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhkYXRlU3RyKCkgKyBcIlNlbnQgcGF5bG9hZCB3aXRoIGZpbHQgOiBcIiArIEpTT04uc3RyaW5naWZ5KHBheWxvYWQuZmlsdCkpO1xuICAgIH1cblxuXG59XG5cbi8vICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbmNsYXNzIF9Wb3J0ZXhDbGllbnRIdHRwQ29ubmVjdGlvbiB7XG5cblxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFJFQ09OTkVDVF9TSVpFX0xJTUlUID0gMjAgKiAxMDI0ICogMTAyNDsgLy8gMjAgbWVnYWJ5dGVzXG5cbiAgICBwcml2YXRlIF92b3J0ZXg6IFZvcnRleENsaWVudEh0dHA7XG4gICAgcHJpdmF0ZSBfaHR0cDogWE1MSHR0cFJlcXVlc3Q7XG4gICAgcHJpdmF0ZSBfdXBkYXRlVGltZXI6IGFueTtcbiAgICBwcml2YXRlIF9yZXNwb25zZVBhcnNlSW5kZXg6IG51bWJlcjtcbiAgICBwcml2YXRlIF9jbG9zaW5nOiBib29sZWFuO1xuICAgIHByaXZhdGUgX2Fib3J0aW5nOiBib29sZWFuO1xuXG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHZvcnRleDogVm9ydGV4Q2xpZW50SHR0cCxcbiAgICAgICAgICAgICAgICBwcml2YXRlIHZvcnRleFN0YXR1c1NlcnZpY2U6IFZvcnRleFN0YXR1c1NlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSByZWNlaXZlQ2FsbGJhY2s6IFJlY2VpdmVQYXlsb2FkQ2FsbGFibGUsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSB2b3J0ZXhCZWF0Q2FsbGJhY2s6IFZvcnRleEJlYXRDYWxsYWJsZSkge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgbGV0IHJhbmRBcmcgPSBNYXRoLnJhbmRvbSgpICsgXCIuXCIgKyAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xuICAgICAgICBsZXQgYXJncyA9IHtcbiAgICAgICAgICAgIFwidm9ydGV4VXVpZFwiOiB2b3J0ZXgudXVpZCxcbiAgICAgICAgICAgIFwidm9ydGV4TmFtZVwiOiB2b3J0ZXgubmFtZSxcbiAgICAgICAgICAgIFwiX19yYW5kQXJnX19cIjogcmFuZEFyZ1xuICAgICAgICB9O1xuXG4gICAgICAgIHNlbGYuX2h0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgc2VsZi5faHR0cC5vcGVuKFwiUE9TVFwiLCBzZWxmLnZvcnRleC51cmwgKyBnZXRGaWx0U3RyKGFyZ3MpLCB0cnVlKTtcblxuICAgICAgICBzZWxmLl91cGRhdGVUaW1lciA9IG51bGw7XG5cbiAgICAgICAgLy8gR29vZCBldmVudHNcbiAgICAgICAgc2VsZi5faHR0cC5vbmxvYWRzdGFydCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBzZWxmLl9yZWNlaXZlZCgpO1xuXG4gICAgICAgICAgICAvLyBGb3JjZSBhIDUwIG1pbGxpc2Vjb25kIHRpbWVyLCBhcyBzb21lIGJyb3dzZXJzIGRvbid0IGNhbGwgXCJvbnByb2dyZXNzXCJcbiAgICAgICAgICAgIC8vIHZlcnkgb2Z0ZW4uXG4gICAgICAgICAgICBzZWxmLl91cGRhdGVUaW1lciA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLl9yZWNlaXZlZCgpO1xuICAgICAgICAgICAgfSwgNTApO1xuICAgICAgICB9O1xuXG4gICAgICAgIHNlbGYuX2h0dHAub25wcm9ncmVzcyA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBzZWxmLl9yZWNlaXZlZCgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHNlbGYuX2h0dHAub25sb2FkID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGlmIChzZWxmLl91cGRhdGVUaW1lcilcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHNlbGYuX3VwZGF0ZVRpbWVyKTtcbiAgICAgICAgICAgIHNlbGYuX3JlY2VpdmVkKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gQmFkIGV2ZW50c1xuICAgICAgICBzZWxmLl9odHRwLm9uYWJvcnQgPSBiaW5kKHNlbGYsIHNlbGYuX2Vycm9yKTtcbiAgICAgICAgc2VsZi5faHR0cC5vbmVycm9yID0gYmluZChzZWxmLCBzZWxmLl9lcnJvcik7XG4gICAgICAgIHNlbGYuX2h0dHAub250aW1lb3V0ID0gYmluZChzZWxmLCBzZWxmLl9lcnJvcik7XG5cbiAgICAgICAgc2VsZi5fcmVzcG9uc2VQYXJzZUluZGV4ID0gMDtcbiAgICAgICAgc2VsZi5fY2xvc2luZyA9IGZhbHNlO1xuICAgICAgICBzZWxmLl9hYm9ydGluZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIHNodXRkb3duKCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9jbG9zaW5nID0gdHJ1ZTtcbiAgICAgICAgaWYgKHRoaXMuX2h0dHApXG4gICAgICAgICAgICB0aGlzLl9odHRwLmFib3J0KCk7XG4gICAgfVxuXG4gICAgc2VuZCh2b3J0ZXhNc2dzOiBzdHJpbmdbXSkge1xuICAgICAgICBsZXQgZGF0YSA9IFwiXCI7XG5cbiAgICAgICAgZm9yIChsZXQgdm9ydGV4TXNnIG9mIHZvcnRleE1zZ3MpIHtcbiAgICAgICAgICAgIC8vIFNlcmlhbGlzZSB0aGUgcGF5bG9hZFxuICAgICAgICAgICAgZGF0YSArPSB2b3J0ZXhNc2cgKyBcIi5cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwic2VuZGluZyBwYXlsb2FkXCIpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh4bWxTdHIpO1xuICAgICAgICB0aGlzLl9odHRwLnNlbmQoZGF0YSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfcmVjZWl2ZWQoKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgLypcbiAgICAgICAgICogUmVjZWl2ZWRcbiAgICAgICAgICpcbiAgICAgICAgICogQ2FsbGVkIHdoZW4gcHJvZ3Jlc3MgaXMgbWFkZSBvbiByZWNlaXZpbmcgZGF0YSBmcm9tIHRoZSB2b3J0ZXggc2VydmVyLlxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGlzIG1lYW5zIHRoYXQgaXQgbmVlZHMgdG8gYmUgYWJsZSB0byBoYW5kbGUgOiAqIHBhcnRpYWwgcGF5bG9hZHMgKGluXG4gICAgICAgICAqIHdoaWNoIGNhc2UgaXQgZG9lcyBub3RoaW5nKSAqIG11bHRpcGxlIHBheWxvYWRzIChpbiB3aGljaCBjYXNlLCBpdCBicmVha3NcbiAgICAgICAgICogdGhlbSB1cCwgcGFyc2VzIHRoZW0gYW5kIHNlbmRzIHRoZW0gdG8gdm9ydGV4IGluZGl2aWR1YWxseSlcbiAgICAgICAgICovXG5cbiAgICAgICAgaWYgKHNlbGYuX2Fib3J0aW5nKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIC8vIElmIHdlIHJlY2VpdmUgc29tZXRoaW5nIHRoYXQgaXMgbm90IHZhbGlkIHZvcnRleCBkYXRhLCB0aGVuIHJlbG9hZCB0aGUgcGFnZVxuICAgICAgICAvLyBUaGlzIHR5cGljYWxseSBvY2N1cnMgd2hlbiB3ZSdyZSByZWNldmluZyBIVE1MIGJlY2F1c2Ugd2UncmUgbm90IGxvZ2dlZCBpbi5cbiAgICAgICAgaWYgKCgvXjwvKS50ZXN0KHNlbGYuX2h0dHAucmVzcG9uc2VUZXh0KSkge1xuXG4gICAgICAgICAgICBzZWxmLnZvcnRleC5jbG9zZWQgPSB0cnVlO1xuICAgICAgICAgICAgc2VsZi5fY2xvc2luZyA9IHRydWU7XG4gICAgICAgICAgICBzZWxmLl9hYm9ydGluZyA9IHRydWU7XG4gICAgICAgICAgICBzZWxmLl9odHRwLmFib3J0KCk7XG5cbiAgICAgICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU3BsaXQgb3V0IHRoZSBwYXlsb2FkcyBvZiBkYXRhLCB0aGV5IGFyZSBkZWxpbWl0ZWQgYnkgYSAnLidcbiAgICAgICAgbGV0IGRhdGEgPSBzZWxmLl9odHRwLnJlc3BvbnNlVGV4dC5zdWJzdHIoc2VsZi5fcmVzcG9uc2VQYXJzZUluZGV4KTtcbiAgICAgICAgbGV0IHBheWxvYWRTZXBhcmF0b3JJbmRleCA9IGRhdGEuaW5kZXhPZihcIi5cIik7XG5cbiAgICAgICAgd2hpbGUgKHBheWxvYWRTZXBhcmF0b3JJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgIHNlbGYuX3Jlc3BvbnNlUGFyc2VJbmRleCArPSBwYXlsb2FkU2VwYXJhdG9ySW5kZXggKyAxO1xuXG4gICAgICAgICAgICAvLyBHZXQgdGhlIGI2NGVuY29kZWQgc3RyaW5nXG4gICAgICAgICAgICBsZXQgdm9ydGV4U3RyID0gZGF0YS5zdWJzdHIoMCwgcGF5bG9hZFNlcGFyYXRvckluZGV4KTtcblxuICAgICAgICAgICAgaWYgKHZvcnRleFN0ci5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICBzZWxmLnZvcnRleEJlYXRDYWxsYmFjaygpO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBwYXlsb2FkIG9iamVjdCBmcm9tIGl0XG4gICAgICAgICAgICAgICAgLy8gU2VuZCB0byB2b3J0ZXhcbiAgICAgICAgICAgICAgICBQYXlsb2FkLmZyb21Wb3J0ZXhNc2codm9ydGV4U3RyKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigocGF5bG9hZDogUGF5bG9hZCkgPT4gc2VsZi5yZWNlaXZlQ2FsbGJhY2socGF5bG9hZCkpXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChlID0+IGNvbnNvbGUubG9nKGBBbiBlcnJvciBvY2N1cmVkIGRlc2VyaWFsaXNpbmcgJHtlfWApKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGF0YSA9IHNlbGYuX2h0dHAucmVzcG9uc2VUZXh0LnN1YnN0cihzZWxmLl9yZXNwb25zZVBhcnNlSW5kZXgpO1xuICAgICAgICAgICAgcGF5bG9hZFNlcGFyYXRvckluZGV4ID0gZGF0YS5pbmRleE9mKFwiLlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEluIHRoZSBldmVudCB0aGF0IHRoZSBicm93c2VyIGlzIGJ1ZmZlcmluZyBhbGwgdGhpcyBkYXRhLCB3ZSBzaG91bGRcbiAgICAgICAgLy8gcmVjb25uZWN0IHRvIGFsbG93IHRoZSBicm93c2VyIHRvIGNsZWFudXAuXG4gICAgICAgIGlmIChzZWxmLl9odHRwLnJlc3BvbnNlVGV4dC5sZW5ndGggPj0gX1ZvcnRleENsaWVudEh0dHBDb25uZWN0aW9uLlJFQ09OTkVDVF9TSVpFX0xJTUlUXG4gICAgICAgICAgICAmJiAhc2VsZi5fY2xvc2luZykge1xuICAgICAgICAgICAgc2VsZi5fY2xvc2luZyA9IHRydWU7XG4gICAgICAgICAgICBzZWxmLnZvcnRleC5yZWNvbm5lY3QoKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfZXJyb3IoZSkge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmIChzZWxmLl91cGRhdGVUaW1lcilcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoc2VsZi5fdXBkYXRlVGltZXIpO1xuXG4gICAgICAgIGlmIChzZWxmLl9hYm9ydGluZyB8fCB0aGlzLl9jbG9zaW5nKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIGxldCBtc2cgPSBcIlwiO1xuXG4gICAgICAgIGlmIChlLnR5cGUgPT09ICdhYm9ydCcpIHtcbiAgICAgICAgICAgIG1zZyA9IFwiUmVxdWVzdCB3YXMgYWJvcnRlZCBhbmQgbm90IGJ5IFZvcnRleEpTXCI7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbXNnID0gZS50b1N0cmluZygpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnZvcnRleFN0YXR1c1NlcnZpY2Uuc2V0T25saW5lKGZhbHNlKTtcbiAgICAgICAgdGhpcy52b3J0ZXhTdGF0dXNTZXJ2aWNlLmxvZ0Vycm9yKG1zZyk7XG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJWb3J0ZXhDb25uZWN0aW9uLCBjb25uZWN0aW9uIGVycm9yZWQgb3V0OiBcIiArIG1zZyk7XG4gICAgfVxuXG59XG4iXX0=