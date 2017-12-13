"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var VortexStatusService_1 = require("./VortexStatusService");
var VortexService_1 = require("./VortexService");
var PayloadResponse_1 = require("./PayloadResponse");
var Payload_1 = require("./Payload");
var UtilMisc_1 = require("./UtilMisc");
var TupleActionPushNameService = (function () {
    function TupleActionPushNameService(name, additionalFilt) {
        if (additionalFilt === void 0) { additionalFilt = {}; }
        this.name = name;
        this.additionalFilt = additionalFilt;
    }
    TupleActionPushNameService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [String, Object])
    ], TupleActionPushNameService);
    return TupleActionPushNameService;
}());
exports.TupleActionPushNameService = TupleActionPushNameService;
var TupleActionPushService = (function () {
    function TupleActionPushService(tupleActionProcessorName, vortexService, vortexStatus) {
        this.tupleActionProcessorName = tupleActionProcessorName;
        this.vortexService = vortexService;
        this.vortexStatus = vortexStatus;
    }
    /** Push Action
     *
     * This pushes the action, either locally or to the server, depending on the
     * implementation.
     *
     * If pushed locally, the promise will resolve when the action has been saved.
     * If pushed directly to the server, the promise will resolve when the server has
     * responded.
     */
    TupleActionPushService.prototype.pushAction = function (tupleAction) {
        if (!this.vortexStatus.snapshot.isOnline)
            return Promise.reject("Vortex is offline");
        var payloadResponse = new PayloadResponse_1.PayloadResponse(this.vortexService, this.makePayload(tupleAction));
        var convertedPromise = payloadResponse
            .then(function (payload) {
            return payload.tuples;
        });
        return convertedPromise;
    };
    /** Make Payload
     *
     * This make the payload that we send to the server.
     *
     */
    TupleActionPushService.prototype.makePayload = function (tupleAction) {
        var payload = new Payload_1.Payload();
        payload.filt = UtilMisc_1.extend({
            key: "tupleActionProcessorName",
            name: this.tupleActionProcessorName.name
        }, this.tupleActionProcessorName.additionalFilt);
        payload.tuples = [tupleAction];
        return payload;
    };
    TupleActionPushService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [TupleActionPushNameService,
            VortexService_1.VortexService,
            VortexStatusService_1.VortexStatusService])
    ], TupleActionPushService);
    return TupleActionPushService;
}());
exports.TupleActionPushService = TupleActionPushService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHVwbGVBY3Rpb25QdXNoU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlR1cGxlQWN0aW9uUHVzaFNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBeUM7QUFDekMsNkRBQTBEO0FBRzFELGlEQUE4QztBQUM5QyxxREFBa0Q7QUFDbEQscUNBQWtDO0FBQ2xDLHVDQUFrQztBQUlsQztJQUNJLG9DQUFtQixJQUFZLEVBQVMsY0FBbUI7UUFBbkIsK0JBQUEsRUFBQSxtQkFBbUI7UUFBeEMsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFTLG1CQUFjLEdBQWQsY0FBYyxDQUFLO0lBRTNELENBQUM7SUFIUSwwQkFBMEI7UUFEdEMsaUJBQVUsRUFBRTs7T0FDQSwwQkFBMEIsQ0FJdEM7SUFBRCxpQ0FBQztDQUFBLEFBSkQsSUFJQztBQUpZLGdFQUEwQjtBQVF2QztJQUVJLGdDQUFzQix3QkFBb0QsRUFDcEQsYUFBNEIsRUFDNUIsWUFBaUM7UUFGakMsNkJBQXdCLEdBQXhCLHdCQUF3QixDQUE0QjtRQUNwRCxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixpQkFBWSxHQUFaLFlBQVksQ0FBcUI7SUFDdkQsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ0gsMkNBQVUsR0FBVixVQUFXLFdBQTJCO1FBQ2xDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO1lBQ3JDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFFL0MsSUFBSSxlQUFlLEdBQUcsSUFBSSxpQ0FBZSxDQUNyQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUV2RCxJQUFJLGdCQUFnQixHQUFPLGVBQWU7YUFDckMsSUFBSSxDQUFDLFVBQUEsT0FBTztZQUNULE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQzFCLENBQUMsQ0FBQyxDQUFDO1FBQ1AsTUFBTSxDQUFDLGdCQUFnQixDQUFDO0lBRTVCLENBQUM7SUFFRDs7OztPQUlHO0lBQ08sNENBQVcsR0FBckIsVUFBc0IsV0FBMkI7UUFFN0MsSUFBSSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7UUFFNUIsT0FBTyxDQUFDLElBQUksR0FBRyxpQkFBTSxDQUFDO1lBQ2xCLEdBQUcsRUFBRSwwQkFBMEI7WUFDL0IsSUFBSSxFQUFFLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJO1NBQzNDLEVBQUUsSUFBSSxDQUFDLHdCQUF3QixDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRWpELE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUUvQixNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFoRFEsc0JBQXNCO1FBRGxDLGlCQUFVLEVBQUU7eUNBR3VDLDBCQUEwQjtZQUNyQyw2QkFBYTtZQUNkLHlDQUFtQjtPQUo5QyxzQkFBc0IsQ0FrRGxDO0lBQUQsNkJBQUM7Q0FBQSxBQWxERCxJQWtEQztBQWxEWSx3REFBc0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQge1ZvcnRleFN0YXR1c1NlcnZpY2V9IGZyb20gXCIuL1ZvcnRleFN0YXR1c1NlcnZpY2VcIjtcbmltcG9ydCB7VHVwbGVBY3Rpb25BQkN9IGZyb20gXCIuL1R1cGxlQWN0aW9uXCI7XG5pbXBvcnQge1R1cGxlfSBmcm9tIFwiLi9UdXBsZVwiO1xuaW1wb3J0IHtWb3J0ZXhTZXJ2aWNlfSBmcm9tIFwiLi9Wb3J0ZXhTZXJ2aWNlXCI7XG5pbXBvcnQge1BheWxvYWRSZXNwb25zZX0gZnJvbSBcIi4vUGF5bG9hZFJlc3BvbnNlXCI7XG5pbXBvcnQge1BheWxvYWR9IGZyb20gXCIuL1BheWxvYWRcIjtcbmltcG9ydCB7ZXh0ZW5kfSBmcm9tIFwiLi9VdGlsTWlzY1wiO1xuXG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBUdXBsZUFjdGlvblB1c2hOYW1lU2VydmljZSB7XG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZywgcHVibGljIGFkZGl0aW9uYWxGaWx0ID0ge30pIHtcblxuICAgIH1cbn1cblxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVHVwbGVBY3Rpb25QdXNoU2VydmljZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgdHVwbGVBY3Rpb25Qcm9jZXNzb3JOYW1lOiBUdXBsZUFjdGlvblB1c2hOYW1lU2VydmljZSxcbiAgICAgICAgICAgICAgICBwcm90ZWN0ZWQgdm9ydGV4U2VydmljZTogVm9ydGV4U2VydmljZSxcbiAgICAgICAgICAgICAgICBwcm90ZWN0ZWQgdm9ydGV4U3RhdHVzOiBWb3J0ZXhTdGF0dXNTZXJ2aWNlKSB7XG4gICAgfVxuXG4gICAgLyoqIFB1c2ggQWN0aW9uXG4gICAgICpcbiAgICAgKiBUaGlzIHB1c2hlcyB0aGUgYWN0aW9uLCBlaXRoZXIgbG9jYWxseSBvciB0byB0aGUgc2VydmVyLCBkZXBlbmRpbmcgb24gdGhlXG4gICAgICogaW1wbGVtZW50YXRpb24uXG4gICAgICpcbiAgICAgKiBJZiBwdXNoZWQgbG9jYWxseSwgdGhlIHByb21pc2Ugd2lsbCByZXNvbHZlIHdoZW4gdGhlIGFjdGlvbiBoYXMgYmVlbiBzYXZlZC5cbiAgICAgKiBJZiBwdXNoZWQgZGlyZWN0bHkgdG8gdGhlIHNlcnZlciwgdGhlIHByb21pc2Ugd2lsbCByZXNvbHZlIHdoZW4gdGhlIHNlcnZlciBoYXNcbiAgICAgKiByZXNwb25kZWQuXG4gICAgICovXG4gICAgcHVzaEFjdGlvbih0dXBsZUFjdGlvbjogVHVwbGVBY3Rpb25BQkMpOiBQcm9taXNlPFR1cGxlW10+IHtcbiAgICAgICAgaWYgKCF0aGlzLnZvcnRleFN0YXR1cy5zbmFwc2hvdC5pc09ubGluZSlcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcIlZvcnRleCBpcyBvZmZsaW5lXCIpO1xuXG4gICAgICAgIGxldCBwYXlsb2FkUmVzcG9uc2UgPSBuZXcgUGF5bG9hZFJlc3BvbnNlKFxuICAgICAgICAgICAgdGhpcy52b3J0ZXhTZXJ2aWNlLCB0aGlzLm1ha2VQYXlsb2FkKHR1cGxlQWN0aW9uKSk7XG5cbiAgICAgICAgbGV0IGNvbnZlcnRlZFByb21pc2U6YW55ID0gcGF5bG9hZFJlc3BvbnNlXG4gICAgICAgICAgICAudGhlbihwYXlsb2FkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGF5bG9hZC50dXBsZXM7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGNvbnZlcnRlZFByb21pc2U7XG5cbiAgICB9XG5cbiAgICAvKiogTWFrZSBQYXlsb2FkXG4gICAgICpcbiAgICAgKiBUaGlzIG1ha2UgdGhlIHBheWxvYWQgdGhhdCB3ZSBzZW5kIHRvIHRoZSBzZXJ2ZXIuXG4gICAgICpcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgbWFrZVBheWxvYWQodHVwbGVBY3Rpb246IFR1cGxlQWN0aW9uQUJDKTogUGF5bG9hZCB7XG5cbiAgICAgICAgbGV0IHBheWxvYWQgPSBuZXcgUGF5bG9hZCgpO1xuXG4gICAgICAgIHBheWxvYWQuZmlsdCA9IGV4dGVuZCh7XG4gICAgICAgICAgICBrZXk6IFwidHVwbGVBY3Rpb25Qcm9jZXNzb3JOYW1lXCIsXG4gICAgICAgICAgICBuYW1lOiB0aGlzLnR1cGxlQWN0aW9uUHJvY2Vzc29yTmFtZS5uYW1lXG4gICAgICAgIH0sIHRoaXMudHVwbGVBY3Rpb25Qcm9jZXNzb3JOYW1lLmFkZGl0aW9uYWxGaWx0KTtcblxuICAgICAgICBwYXlsb2FkLnR1cGxlcyA9IFt0dXBsZUFjdGlvbl07XG5cbiAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgfVxuXG59XG4iXX0=