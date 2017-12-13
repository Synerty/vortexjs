"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Payload_1 = require("./Payload");
var core_1 = require("@angular/core");
var PayloadEndpoint_1 = require("./PayloadEndpoint");
var TupleLoader_1 = require("./TupleLoader");
var ng2_balloon_msg_1 = require("@synerty/ng2-balloon-msg");
var VortexStatusService_1 = require("./VortexStatusService");
var VortexClientHttp_1 = require("./VortexClientHttp");
var VortexClientWebsocket_1 = require("./VortexClientWebsocket");
var VortexService = (function () {
    function VortexService(vortexStatusService, zone, balloonMsg) {
        //
        this.vortexStatusService = vortexStatusService;
        this.zone = zone;
        this.balloonMsg = balloonMsg;
        this.reconnect();
    }
    VortexService_1 = VortexService;
    /**
     * Set Vortex URL
     *
     * This method should not be used except in rare cases, such as a NativeScript app.
     *
     * @param url: The new URL for the vortex to use.
     */
    VortexService.setVortexUrl = function (url) {
        VortexService_1.vortexUrl = url;
    };
    VortexService.prototype.reconnect = function () {
        if (this.vortex != null)
            this.vortex.closed = true;
        if (VortexService_1.vortexUrl == null) {
            this.vortexStatusService.setOnline(false);
            return;
        }
        if (VortexService_1.vortexUrl.toLowerCase().startsWith("ws")) {
            this.vortex = new VortexClientWebsocket_1.VortexClientWebsocket(this.vortexStatusService, this.zone, VortexService_1.vortexUrl);
        }
        else {
            this.vortex = new VortexClientHttp_1.VortexClientHttp(this.vortexStatusService, this.zone, VortexService_1.vortexUrl);
        }
        this.vortex.reconnect();
    };
    VortexService.prototype.sendTuple = function (filt, tuples) {
        if (typeof filt === "string") {
            filt = { key: filt };
        }
        this.sendPayload(new Payload_1.Payload(filt, tuples));
    };
    VortexService.prototype.sendFilt = function (filt) {
        this.sendPayload(new Payload_1.Payload(filt));
    };
    VortexService.prototype.sendPayload = function (payload) {
        if (this.vortex == null) {
            throw new Error("The vortex is not initialised yet.");
        }
        this.vortex.send(payload);
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
        return new TupleLoader_1.TupleLoader(this.vortex, component, this.zone, filterUpdateCallable, this.balloonMsg);
    };
    VortexService.vortexUrl = '/vortex';
    VortexService = VortexService_1 = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [VortexStatusService_1.VortexStatusService,
            core_1.NgZone,
            ng2_balloon_msg_1.Ng2BalloonMsgService])
    ], VortexService);
    return VortexService;
    var VortexService_1;
}());
exports.VortexService = VortexService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVm9ydGV4U2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlZvcnRleFNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBZ0Q7QUFDaEQsc0NBQWlEO0FBSWpELHFEQUFrRDtBQUNsRCw2Q0FBaUU7QUFDakUsNERBQThEO0FBQzlELDZEQUEwRDtBQUUxRCx1REFBb0Q7QUFDcEQsaUVBQThEO0FBRzlEO0lBSUksdUJBQW9CLG1CQUF3QyxFQUN4QyxJQUFZLEVBQ1osVUFBZ0M7UUFDaEQsRUFBRTtRQUhjLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7UUFDeEMsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUNaLGVBQVUsR0FBVixVQUFVLENBQXNCO1FBR2hELElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNyQixDQUFDO3NCQVZRLGFBQWE7SUFZdEI7Ozs7OztPQU1HO0lBQ0ksMEJBQVksR0FBbkIsVUFBb0IsR0FBVztRQUMzQixlQUFhLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztJQUNsQyxDQUFDO0lBRUQsaUNBQVMsR0FBVDtRQUNJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUU5QixFQUFFLENBQUMsQ0FBQyxlQUFhLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxNQUFNLENBQUM7UUFDWCxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsZUFBYSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pELElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSw2Q0FBcUIsQ0FDbkMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsZUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3RFLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxtQ0FBZ0IsQ0FDOUIsSUFBSSxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsZUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3RFLENBQUM7UUFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzVCLENBQUM7SUFFRCxpQ0FBUyxHQUFULFVBQVUsSUFBMkIsRUFBRSxNQUF1QjtRQUMxRCxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQUksR0FBRyxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUMsQ0FBQztRQUN2QixDQUFDO1FBRUQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLGlCQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVELGdDQUFRLEdBQVIsVUFBUyxJQUFJO1FBQ1QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLGlCQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRUQsbUNBQVcsR0FBWCxVQUFZLE9BQTJCO1FBQ25DLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN0QixNQUFNLElBQUksS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7UUFDMUQsQ0FBQztRQUNELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRCxnREFBd0IsR0FBeEIsVUFBeUIsU0FBeUMsRUFDekMsTUFBb0IsRUFDcEIsaUJBQWtDO1FBQWxDLGtDQUFBLEVBQUEseUJBQWtDO1FBQ3ZELElBQUksUUFBUSxHQUFHLElBQUksaUNBQWUsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFFekUsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxpQkFBaUIsQ0FBQyxDQUFDLFVBQVUsQ0FBQztJQUNoRixDQUFDO0lBRUQsc0NBQWMsR0FBZCxVQUFlLFNBQXlDLEVBQ3pDLE1BQW9CLEVBQ3BCLGlCQUFrQztRQUFsQyxrQ0FBQSxFQUFBLHlCQUFrQztRQUM3QyxNQUFNLENBQUMsSUFBSSxpQ0FBZSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBRUQseUNBQWlCLEdBQWpCLFVBQWtCLFNBQXlDLEVBQ3pDLG9CQUEwRDtRQUN4RSxNQUFNLENBQUMsSUFBSSx5QkFBVyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQzlCLFNBQVMsRUFDVCxJQUFJLENBQUMsSUFBSSxFQUNULG9CQUFvQixFQUNwQixJQUFJLENBQUMsVUFBVSxDQUNsQixDQUFDO0lBQ04sQ0FBQztJQWxGYyx1QkFBUyxHQUFXLFNBQVMsQ0FBQztJQUZwQyxhQUFhO1FBRHpCLGlCQUFVLEVBQUU7eUNBS2dDLHlDQUFtQjtZQUNsQyxhQUFNO1lBQ0Esc0NBQW9CO09BTjNDLGFBQWEsQ0FxRnpCO0lBQUQsb0JBQUM7O0NBQUEsQUFyRkQsSUFxRkM7QUFyRlksc0NBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0lQYXlsb2FkRmlsdCwgUGF5bG9hZH0gZnJvbSBcIi4vUGF5bG9hZFwiO1xuaW1wb3J0IHtJbmplY3RhYmxlLCBOZ1pvbmV9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQge1R1cGxlfSBmcm9tIFwiLi9UdXBsZVwiO1xuaW1wb3J0IHtDb21wb25lbnRMaWZlY3ljbGVFdmVudEVtaXR0ZXJ9IGZyb20gXCIuL0NvbXBvbmVudExpZmVjeWNsZUV2ZW50RW1pdHRlclwiO1xuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tIFwicnhqc1wiO1xuaW1wb3J0IHtQYXlsb2FkRW5kcG9pbnR9IGZyb20gXCIuL1BheWxvYWRFbmRwb2ludFwiO1xuaW1wb3J0IHtJRmlsdGVyVXBkYXRlQ2FsbGFibGUsIFR1cGxlTG9hZGVyfSBmcm9tIFwiLi9UdXBsZUxvYWRlclwiO1xuaW1wb3J0IHtOZzJCYWxsb29uTXNnU2VydmljZX0gZnJvbSBcIkBzeW5lcnR5L25nMi1iYWxsb29uLW1zZ1wiO1xuaW1wb3J0IHtWb3J0ZXhTdGF0dXNTZXJ2aWNlfSBmcm9tIFwiLi9Wb3J0ZXhTdGF0dXNTZXJ2aWNlXCI7XG5pbXBvcnQge1ZvcnRleENsaWVudEFCQ30gZnJvbSBcIi4vVm9ydGV4Q2xpZW50QUJDXCI7XG5pbXBvcnQge1ZvcnRleENsaWVudEh0dHB9IGZyb20gXCIuL1ZvcnRleENsaWVudEh0dHBcIjtcbmltcG9ydCB7Vm9ydGV4Q2xpZW50V2Vic29ja2V0fSBmcm9tIFwiLi9Wb3J0ZXhDbGllbnRXZWJzb2NrZXRcIjtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFZvcnRleFNlcnZpY2Uge1xuICAgIHByaXZhdGUgdm9ydGV4OiBWb3J0ZXhDbGllbnRBQkM7XG4gICAgcHJpdmF0ZSBzdGF0aWMgdm9ydGV4VXJsOiBzdHJpbmcgPSAnL3ZvcnRleCc7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHZvcnRleFN0YXR1c1NlcnZpY2U6IFZvcnRleFN0YXR1c1NlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSB6b25lOiBOZ1pvbmUsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBiYWxsb29uTXNnOiBOZzJCYWxsb29uTXNnU2VydmljZSkge1xuICAgICAgICAvL1xuXG4gICAgICAgIHRoaXMucmVjb25uZWN0KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0IFZvcnRleCBVUkxcbiAgICAgKlxuICAgICAqIFRoaXMgbWV0aG9kIHNob3VsZCBub3QgYmUgdXNlZCBleGNlcHQgaW4gcmFyZSBjYXNlcywgc3VjaCBhcyBhIE5hdGl2ZVNjcmlwdCBhcHAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdXJsOiBUaGUgbmV3IFVSTCBmb3IgdGhlIHZvcnRleCB0byB1c2UuXG4gICAgICovXG4gICAgc3RhdGljIHNldFZvcnRleFVybCh1cmw6IHN0cmluZykge1xuICAgICAgICBWb3J0ZXhTZXJ2aWNlLnZvcnRleFVybCA9IHVybDtcbiAgICB9XG5cbiAgICByZWNvbm5lY3QoKSB7XG4gICAgICAgIGlmICh0aGlzLnZvcnRleCAhPSBudWxsKVxuICAgICAgICAgICAgdGhpcy52b3J0ZXguY2xvc2VkID0gdHJ1ZTtcblxuICAgICAgICBpZiAoVm9ydGV4U2VydmljZS52b3J0ZXhVcmwgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy52b3J0ZXhTdGF0dXNTZXJ2aWNlLnNldE9ubGluZShmYWxzZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoVm9ydGV4U2VydmljZS52b3J0ZXhVcmwudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKFwid3NcIikpIHtcbiAgICAgICAgICAgIHRoaXMudm9ydGV4ID0gbmV3IFZvcnRleENsaWVudFdlYnNvY2tldChcbiAgICAgICAgICAgICAgICB0aGlzLnZvcnRleFN0YXR1c1NlcnZpY2UsIHRoaXMuem9uZSwgVm9ydGV4U2VydmljZS52b3J0ZXhVcmwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy52b3J0ZXggPSBuZXcgVm9ydGV4Q2xpZW50SHR0cChcbiAgICAgICAgICAgICAgICB0aGlzLnZvcnRleFN0YXR1c1NlcnZpY2UsIHRoaXMuem9uZSwgVm9ydGV4U2VydmljZS52b3J0ZXhVcmwpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy52b3J0ZXgucmVjb25uZWN0KCk7XG4gICAgfVxuXG4gICAgc2VuZFR1cGxlKGZpbHQ6IElQYXlsb2FkRmlsdCB8IHN0cmluZywgdHVwbGVzOiBhbnlbXSB8IFR1cGxlW10pOiB2b2lkIHtcbiAgICAgICAgaWYgKHR5cGVvZiBmaWx0ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBmaWx0ID0ge2tleTogZmlsdH07XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNlbmRQYXlsb2FkKG5ldyBQYXlsb2FkKGZpbHQsIHR1cGxlcykpO1xuICAgIH1cblxuICAgIHNlbmRGaWx0KGZpbHQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZW5kUGF5bG9hZChuZXcgUGF5bG9hZChmaWx0KSk7XG4gICAgfVxuXG4gICAgc2VuZFBheWxvYWQocGF5bG9hZDpQYXlsb2FkW10gfCBQYXlsb2FkKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnZvcnRleCA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgdm9ydGV4IGlzIG5vdCBpbml0aWFsaXNlZCB5ZXQuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudm9ydGV4LnNlbmQocGF5bG9hZCk7XG4gICAgfVxuXG4gICAgY3JlYXRlRW5kcG9pbnRPYnNlcnZhYmxlKGNvbXBvbmVudDogQ29tcG9uZW50TGlmZWN5Y2xlRXZlbnRFbWl0dGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6IElQYXlsb2FkRmlsdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc0xhdGVzdE9ubHk6IGJvb2xlYW4gPSBmYWxzZSk6IE9ic2VydmFibGU8UGF5bG9hZD4ge1xuICAgICAgICBsZXQgZW5kcG9pbnQgPSBuZXcgUGF5bG9hZEVuZHBvaW50KGNvbXBvbmVudCwgZmlsdGVyLCBwcm9jZXNzTGF0ZXN0T25seSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlRW5kcG9pbnQoY29tcG9uZW50LCBmaWx0ZXIsIHByb2Nlc3NMYXRlc3RPbmx5KS5vYnNlcnZhYmxlO1xuICAgIH1cblxuICAgIGNyZWF0ZUVuZHBvaW50KGNvbXBvbmVudDogQ29tcG9uZW50TGlmZWN5Y2xlRXZlbnRFbWl0dGVyLFxuICAgICAgICAgICAgICAgICAgIGZpbHRlcjogSVBheWxvYWRGaWx0LFxuICAgICAgICAgICAgICAgICAgIHByb2Nlc3NMYXRlc3RPbmx5OiBib29sZWFuID0gZmFsc2UpOiBQYXlsb2FkRW5kcG9pbnQge1xuICAgICAgICByZXR1cm4gbmV3IFBheWxvYWRFbmRwb2ludChjb21wb25lbnQsIGZpbHRlciwgcHJvY2Vzc0xhdGVzdE9ubHkpO1xuICAgIH1cblxuICAgIGNyZWF0ZVR1cGxlTG9hZGVyKGNvbXBvbmVudDogQ29tcG9uZW50TGlmZWN5Y2xlRXZlbnRFbWl0dGVyLFxuICAgICAgICAgICAgICAgICAgICAgIGZpbHRlclVwZGF0ZUNhbGxhYmxlOiBJRmlsdGVyVXBkYXRlQ2FsbGFibGUgfCBJUGF5bG9hZEZpbHQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUdXBsZUxvYWRlcih0aGlzLnZvcnRleCxcbiAgICAgICAgICAgIGNvbXBvbmVudCxcbiAgICAgICAgICAgIHRoaXMuem9uZSxcbiAgICAgICAgICAgIGZpbHRlclVwZGF0ZUNhbGxhYmxlLFxuICAgICAgICAgICAgdGhpcy5iYWxsb29uTXNnXG4gICAgICAgICk7XG4gICAgfVxufVxuIl19