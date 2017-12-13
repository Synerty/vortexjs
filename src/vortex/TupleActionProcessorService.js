"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Payload_1 = require("./Payload");
var UtilMisc_1 = require("./UtilMisc");
var VortexService_1 = require("./VortexService");
var ComponentLifecycleEventEmitter_1 = require("./ComponentLifecycleEventEmitter");
var VortexStatusService_1 = require("./VortexStatusService");
var core_1 = require("@angular/core");
var TupleActionProcessorNameService = (function () {
    function TupleActionProcessorNameService(name, additionalFilt) {
        if (additionalFilt === void 0) { additionalFilt = {}; }
        this.name = name;
        this.additionalFilt = additionalFilt;
    }
    TupleActionProcessorNameService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [String, Object])
    ], TupleActionProcessorNameService);
    return TupleActionProcessorNameService;
}());
exports.TupleActionProcessorNameService = TupleActionProcessorNameService;
var TupleActionProcessorService = (function (_super) {
    __extends(TupleActionProcessorService, _super);
    function TupleActionProcessorService(tupleActionProcessorName, vortexService, vortexStatusService) {
        var _this = _super.call(this) || this;
        _this.tupleActionProcessorName = tupleActionProcessorName;
        _this.vortexService = vortexService;
        _this.vortexStatusService = vortexStatusService;
        _this._tupleProcessorsByTupleName = {};
        _this.defaultDelegate = null;
        var filt = UtilMisc_1.extend({
            name: tupleActionProcessorName.name,
            key: "tupleActionProcessorName"
        }, tupleActionProcessorName.additionalFilt);
        vortexService.createEndpointObservable(_this, filt)
            .subscribe(function (payload) { return _this._process(payload); });
        return _this;
    }
    /** Add Tuple Action Processor Delegate
     *
     *@param tupleName: The tuple name to process actions for.
     *@param processor: The processor to use for processing this tuple name.
     *
     */
    TupleActionProcessorService.prototype.setDelegate = function (tupleName, delegate) {
        UtilMisc_1.assert(tupleName in this._tupleProcessorsByTupleName, "TupleActionProcessor:" + this.tupleActionProcessorName.name + ", "
            + ("Tuple name " + tupleName + " is already registered"));
        this._tupleProcessorsByTupleName[tupleName] = delegate;
    };
    /** Set Default Tuple Action Processor Delegate
     *
     *@param processor: The processor to use for processing unhandled TupleActions.
     *
     */
    TupleActionProcessorService.prototype.setDefaultDelegate = function (delegate) {
        this.defaultDelegate = delegate;
    };
    /** Process the Payload / Tuple Action
     *
     */
    TupleActionProcessorService.prototype._process = function (payload) {
        var _this = this;
        UtilMisc_1.assert(payload.tuples.length === 1, "TupleActionProcessor:" + this.tupleActionProcessorName.name
            + ("Expected 1 tuples, received " + payload.tuples.length));
        var tupleAction = payload.tuples[0];
        var tupleName = tupleAction._tupleName();
        var delegate = null;
        var processor = this._tupleProcessorsByTupleName[tupleName];
        if (processor != null) {
            delegate = processor;
        }
        else if (this.defaultDelegate != null) {
            delegate = this.defaultDelegate;
        }
        else {
            console.log("ERROR No delegate registered for " + tupleName);
            return;
            // throw new Error(`No delegate registered for ${tupleName}`);
        }
        var promise = delegate.processTupleAction(tupleAction);
        promise.then(function (tuples) { return _this.callback(tuples, payload.filt, tupleName); });
        promise.catch(function (err) { return _this.errback(err, payload.filt, tupleName); });
    };
    TupleActionProcessorService.prototype.callback = function (tuples, replyFilt, tupleName) {
        var payload = new Payload_1.Payload(replyFilt, tuples);
        this.vortexService.sendPayload(payload);
    };
    TupleActionProcessorService.prototype.errback = function (err, replyFilt, tupleName) {
        this.vortexStatusService.logError("TupleActionProcessor:" + this.tupleActionProcessorName.name +
            (" Failed to process TupleActon, " + err));
        var payload = new Payload_1.Payload(replyFilt);
        payload.result = err;
        this.vortexService.sendPayload(payload);
    };
    TupleActionProcessorService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [TupleActionProcessorNameService,
            VortexService_1.VortexService,
            VortexStatusService_1.VortexStatusService])
    ], TupleActionProcessorService);
    return TupleActionProcessorService;
}(ComponentLifecycleEventEmitter_1.ComponentLifecycleEventEmitter));
exports.TupleActionProcessorService = TupleActionProcessorService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHVwbGVBY3Rpb25Qcm9jZXNzb3JTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiVHVwbGVBY3Rpb25Qcm9jZXNzb3JTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQWdEO0FBR2hELHVDQUEwQztBQUMxQyxpREFBOEM7QUFDOUMsbUZBQWdGO0FBRWhGLDZEQUEwRDtBQUMxRCxzQ0FBeUM7QUFJekM7SUFDSSx5Q0FBbUIsSUFBWSxFQUFTLGNBQW1CO1FBQW5CLCtCQUFBLEVBQUEsbUJBQW1CO1FBQXhDLFNBQUksR0FBSixJQUFJLENBQVE7UUFBUyxtQkFBYyxHQUFkLGNBQWMsQ0FBSztJQUUzRCxDQUFDO0lBSFEsK0JBQStCO1FBRDNDLGlCQUFVLEVBQUU7O09BQ0EsK0JBQStCLENBSTNDO0lBQUQsc0NBQUM7Q0FBQSxBQUpELElBSUM7QUFKWSwwRUFBK0I7QUFPNUM7SUFBaUQsK0NBQThCO0lBSzNFLHFDQUFvQix3QkFBeUQsRUFDekQsYUFBNEIsRUFDNUIsbUJBQXdDO1FBRjVELFlBR0ksaUJBQU8sU0FTVjtRQVptQiw4QkFBd0IsR0FBeEIsd0JBQXdCLENBQWlDO1FBQ3pELG1CQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLHlCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7UUFOcEQsaUNBQTJCLEdBQUcsRUFBRSxDQUFDO1FBQ2pDLHFCQUFlLEdBQTJDLElBQUksQ0FBQztRQU9uRSxJQUFJLElBQUksR0FBRyxpQkFBTSxDQUFDO1lBQ2QsSUFBSSxFQUFFLHdCQUF3QixDQUFDLElBQUk7WUFDbkMsR0FBRyxFQUFFLDBCQUEwQjtTQUNsQyxFQUFFLHdCQUF3QixDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRTVDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxLQUFJLEVBQUUsSUFBSSxDQUFDO2FBQzdDLFNBQVMsQ0FBQyxVQUFBLE9BQU8sSUFBSSxPQUFBLEtBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQXRC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QztRQUVyQixJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBN0ZRLDJCQUEyQjtRQUR2QyxpQkFBVSxFQUFFO3lDQU1xQywrQkFBK0I7WUFDMUMsNkJBQWE7WUFDUCx5Q0FBbUI7T0FQbkQsMkJBQTJCLENBK0Z2QztJQUFELGtDQUFDO0NBQUEsQUEvRkQsQ0FBaUQsK0RBQThCLEdBK0Y5RTtBQS9GWSxrRUFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0lQYXlsb2FkRmlsdCwgUGF5bG9hZH0gZnJvbSBcIi4vUGF5bG9hZFwiO1xuaW1wb3J0IHtQYXlsb2FkRW5kcG9pbnR9IGZyb20gXCIuL1BheWxvYWRFbmRwb2ludFwiO1xuaW1wb3J0IHtUdXBsZUFjdGlvblByb2Nlc3NvckRlbGVnYXRlQUJDfSBmcm9tIFwiLi9UdXBsZUFjdGlvblByb2Nlc3NvckRlbGVnYXRlXCI7XG5pbXBvcnQge2Fzc2VydCwgZXh0ZW5kfSBmcm9tIFwiLi9VdGlsTWlzY1wiO1xuaW1wb3J0IHtWb3J0ZXhTZXJ2aWNlfSBmcm9tIFwiLi9Wb3J0ZXhTZXJ2aWNlXCI7XG5pbXBvcnQge0NvbXBvbmVudExpZmVjeWNsZUV2ZW50RW1pdHRlcn0gZnJvbSBcIi4vQ29tcG9uZW50TGlmZWN5Y2xlRXZlbnRFbWl0dGVyXCI7XG5pbXBvcnQge1R1cGxlVXBkYXRlQWN0aW9uLCBUdXBsZUdlbmVyaWNBY3Rpb259IGZyb20gXCIuL1R1cGxlQWN0aW9uXCI7XG5pbXBvcnQge1ZvcnRleFN0YXR1c1NlcnZpY2V9IGZyb20gXCIuL1ZvcnRleFN0YXR1c1NlcnZpY2VcIjtcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcblxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVHVwbGVBY3Rpb25Qcm9jZXNzb3JOYW1lU2VydmljZSB7XG4gICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZywgcHVibGljIGFkZGl0aW9uYWxGaWx0ID0ge30pIHtcblxuICAgIH1cbn1cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFR1cGxlQWN0aW9uUHJvY2Vzc29yU2VydmljZSBleHRlbmRzIENvbXBvbmVudExpZmVjeWNsZUV2ZW50RW1pdHRlciB7XG4gICAgcHJpdmF0ZSBfdHVwbGVQcm9jZXNzb3JzQnlUdXBsZU5hbWUgPSB7fTtcbiAgICBwcml2YXRlIGRlZmF1bHREZWxlZ2F0ZSA6bnVsbCB8IFR1cGxlQWN0aW9uUHJvY2Vzc29yRGVsZWdhdGVBQkMgPSBudWxsO1xuXG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHR1cGxlQWN0aW9uUHJvY2Vzc29yTmFtZTogVHVwbGVBY3Rpb25Qcm9jZXNzb3JOYW1lU2VydmljZSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIHZvcnRleFNlcnZpY2U6IFZvcnRleFNlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSB2b3J0ZXhTdGF0dXNTZXJ2aWNlOiBWb3J0ZXhTdGF0dXNTZXJ2aWNlKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIGxldCBmaWx0ID0gZXh0ZW5kKHtcbiAgICAgICAgICAgIG5hbWU6IHR1cGxlQWN0aW9uUHJvY2Vzc29yTmFtZS5uYW1lLFxuICAgICAgICAgICAga2V5OiBcInR1cGxlQWN0aW9uUHJvY2Vzc29yTmFtZVwiXG4gICAgICAgIH0sIHR1cGxlQWN0aW9uUHJvY2Vzc29yTmFtZS5hZGRpdGlvbmFsRmlsdCk7XG5cbiAgICAgICAgdm9ydGV4U2VydmljZS5jcmVhdGVFbmRwb2ludE9ic2VydmFibGUodGhpcywgZmlsdClcbiAgICAgICAgICAgIC5zdWJzY3JpYmUocGF5bG9hZCA9PiB0aGlzLl9wcm9jZXNzKHBheWxvYWQpKTtcblxuICAgIH1cblxuICAgIC8qKiBBZGQgVHVwbGUgQWN0aW9uIFByb2Nlc3NvciBEZWxlZ2F0ZVxuICAgICAqXG4gICAgICpAcGFyYW0gdHVwbGVOYW1lOiBUaGUgdHVwbGUgbmFtZSB0byBwcm9jZXNzIGFjdGlvbnMgZm9yLlxuICAgICAqQHBhcmFtIHByb2Nlc3NvcjogVGhlIHByb2Nlc3NvciB0byB1c2UgZm9yIHByb2Nlc3NpbmcgdGhpcyB0dXBsZSBuYW1lLlxuICAgICAqXG4gICAgICovXG4gICAgc2V0RGVsZWdhdGUodHVwbGVOYW1lOiBzdHJpbmcsIGRlbGVnYXRlOiBUdXBsZUFjdGlvblByb2Nlc3NvckRlbGVnYXRlQUJDKSB7XG5cbiAgICAgICAgYXNzZXJ0KHR1cGxlTmFtZSBpbiB0aGlzLl90dXBsZVByb2Nlc3NvcnNCeVR1cGxlTmFtZSxcbiAgICAgICAgICAgIGBUdXBsZUFjdGlvblByb2Nlc3Nvcjoke3RoaXMudHVwbGVBY3Rpb25Qcm9jZXNzb3JOYW1lLm5hbWV9LCBgXG4gICAgICAgICAgICArIGBUdXBsZSBuYW1lICR7dHVwbGVOYW1lfSBpcyBhbHJlYWR5IHJlZ2lzdGVyZWRgKTtcblxuICAgICAgICB0aGlzLl90dXBsZVByb2Nlc3NvcnNCeVR1cGxlTmFtZVt0dXBsZU5hbWVdID0gZGVsZWdhdGU7XG4gICAgfVxuXG4gICAgLyoqIFNldCBEZWZhdWx0IFR1cGxlIEFjdGlvbiBQcm9jZXNzb3IgRGVsZWdhdGVcbiAgICAgKlxuICAgICAqQHBhcmFtIHByb2Nlc3NvcjogVGhlIHByb2Nlc3NvciB0byB1c2UgZm9yIHByb2Nlc3NpbmcgdW5oYW5kbGVkIFR1cGxlQWN0aW9ucy5cbiAgICAgKlxuICAgICAqL1xuICAgIHNldERlZmF1bHREZWxlZ2F0ZShkZWxlZ2F0ZTogVHVwbGVBY3Rpb25Qcm9jZXNzb3JEZWxlZ2F0ZUFCQykge1xuICAgICAgICB0aGlzLmRlZmF1bHREZWxlZ2F0ZSA9IGRlbGVnYXRlO1xuICAgIH1cblxuXG4gICAgLyoqIFByb2Nlc3MgdGhlIFBheWxvYWQgLyBUdXBsZSBBY3Rpb25cbiAgICAgKlxuICAgICAqL1xuICAgIHByaXZhdGUgX3Byb2Nlc3MocGF5bG9hZDogUGF5bG9hZCkge1xuXG4gICAgICAgIGFzc2VydChwYXlsb2FkLnR1cGxlcy5sZW5ndGggPT09IDEsXG4gICAgICAgICAgICBgVHVwbGVBY3Rpb25Qcm9jZXNzb3I6JHt0aGlzLnR1cGxlQWN0aW9uUHJvY2Vzc29yTmFtZS5uYW1lfWBcbiAgICAgICAgICAgICsgYEV4cGVjdGVkIDEgdHVwbGVzLCByZWNlaXZlZCAke3BheWxvYWQudHVwbGVzLmxlbmd0aH1gKTtcblxuICAgICAgICBsZXQgdHVwbGVBY3Rpb24gPSBwYXlsb2FkLnR1cGxlc1swXTtcblxuICAgICAgICBsZXQgdHVwbGVOYW1lID0gdHVwbGVBY3Rpb24uX3R1cGxlTmFtZSgpO1xuXG4gICAgICAgIGxldCBkZWxlZ2F0ZSA9IG51bGw7XG4gICAgICAgIGxldCBwcm9jZXNzb3IgPSB0aGlzLl90dXBsZVByb2Nlc3NvcnNCeVR1cGxlTmFtZVt0dXBsZU5hbWVdO1xuICAgICAgICBpZiAocHJvY2Vzc29yICE9IG51bGwpIHtcbiAgICAgICAgICAgIGRlbGVnYXRlID0gcHJvY2Vzc29yO1xuXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5kZWZhdWx0RGVsZWdhdGUgIT0gbnVsbCkge1xuICAgICAgICAgICAgZGVsZWdhdGUgPSB0aGlzLmRlZmF1bHREZWxlZ2F0ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBFUlJPUiBObyBkZWxlZ2F0ZSByZWdpc3RlcmVkIGZvciAke3R1cGxlTmFtZX1gKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIC8vIHRocm93IG5ldyBFcnJvcihgTm8gZGVsZWdhdGUgcmVnaXN0ZXJlZCBmb3IgJHt0dXBsZU5hbWV9YCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcHJvbWlzZSA9IGRlbGVnYXRlLnByb2Nlc3NUdXBsZUFjdGlvbih0dXBsZUFjdGlvbik7XG4gICAgICAgIHByb21pc2UudGhlbih0dXBsZXMgPT4gdGhpcy5jYWxsYmFjayh0dXBsZXMsIHBheWxvYWQuZmlsdCwgdHVwbGVOYW1lKSk7XG4gICAgICAgIHByb21pc2UuY2F0Y2goZXJyID0+IHRoaXMuZXJyYmFjayhlcnIsIHBheWxvYWQuZmlsdCwgdHVwbGVOYW1lKSk7XG4gICAgfVxuXG5cbiAgICBwcml2YXRlIGNhbGxiYWNrKHR1cGxlcywgcmVwbHlGaWx0OiB7fSwgdHVwbGVOYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgbGV0IHBheWxvYWQgPSBuZXcgUGF5bG9hZChyZXBseUZpbHQsIHR1cGxlcyk7XG5cbiAgICAgICAgdGhpcy52b3J0ZXhTZXJ2aWNlLnNlbmRQYXlsb2FkKHBheWxvYWQpO1xuICAgIH1cblxuXG4gICAgcHJpdmF0ZSBlcnJiYWNrKGVycjogc3RyaW5nLCByZXBseUZpbHQ6IHt9LCB0dXBsZU5hbWU6IHN0cmluZykge1xuXG4gICAgICAgIHRoaXMudm9ydGV4U3RhdHVzU2VydmljZS5sb2dFcnJvcihcbiAgICAgICAgICAgIGBUdXBsZUFjdGlvblByb2Nlc3Nvcjoke3RoaXMudHVwbGVBY3Rpb25Qcm9jZXNzb3JOYW1lLm5hbWV9YCArXG4gICAgICAgICAgICBgIEZhaWxlZCB0byBwcm9jZXNzIFR1cGxlQWN0b24sICR7ZXJyfWApO1xuXG4gICAgICAgIGxldCBwYXlsb2FkID0gbmV3IFBheWxvYWQocmVwbHlGaWx0KTtcbiAgICAgICAgcGF5bG9hZC5yZXN1bHQgPSBlcnI7XG5cbiAgICAgICAgdGhpcy52b3J0ZXhTZXJ2aWNlLnNlbmRQYXlsb2FkKHBheWxvYWQpO1xuICAgIH1cblxufSJdfQ==