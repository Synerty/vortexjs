"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var VortexService_1 = require("./VortexService");
var TupleSelector_1 = require("./TupleSelector");
var Payload_1 = require("./Payload");
var PayloadEndpoint_1 = require("./PayloadEndpoint");
var ComponentLifecycleEventEmitter_1 = require("./ComponentLifecycleEventEmitter");
var UtilMisc_1 = require("./UtilMisc");
var VortexStatusService_1 = require("./VortexStatusService");
var PayloadResponse_1 = require("./PayloadResponse");
var TupleDataObservableNameService = (function () {
    function TupleDataObservableNameService(name, additionalFilt) {
        if (additionalFilt === void 0) { additionalFilt = {}; }
        this.name = name;
        this.additionalFilt = additionalFilt;
    }
    TupleDataObservableNameService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [String, Object])
    ], TupleDataObservableNameService);
    return TupleDataObservableNameService;
}());
exports.TupleDataObservableNameService = TupleDataObservableNameService;
var CachedSubscribedData = (function () {
    function CachedSubscribedData() {
        this.subject = new rxjs_1.Subject();
        this.tuples = [];
        this.serverResponded = false;
    }
    return CachedSubscribedData;
}());
exports.CachedSubscribedData = CachedSubscribedData;
var TupleDataObserverService = (function (_super) {
    __extends(TupleDataObserverService, _super);
    function TupleDataObserverService(vortexService, statusService, zone, tupleDataObservableName) {
        var _this = _super.call(this) || this;
        _this.vortexService = vortexService;
        _this.statusService = statusService;
        _this.zone = zone;
        _this.cacheByTupleSelector = {};
        _this.filt = UtilMisc_1.extend({
            "name": tupleDataObservableName.name,
            "key": "tupleDataObservable"
        }, tupleDataObservableName.additionalFilt);
        _this.endpoint = new PayloadEndpoint_1.PayloadEndpoint(_this, _this.filt);
        _this.endpoint.observable.subscribe(function (payload) { return _this.receivePayload(payload); });
        statusService.isOnline
            .takeUntil(_this.onDestroyEvent)
            .filter(function (online) { return online === true; })
            .subscribe(function (online) { return _this.vortexOnlineChanged(); });
        // Cleanup dead subscribers every 30 seconds.
        var cleanupTimer = setInterval(function () { return _this.cleanupDeadCaches(); }, 30);
        _this.onDestroyEvent.subscribe(function () { return clearInterval(cleanupTimer); });
        return _this;
    }
    TupleDataObserverService.prototype.pollForTuples = function (tupleSelector) {
        var startFilt = UtilMisc_1.extend({ "subscribe": false }, this.filt, {
            "tupleSelector": tupleSelector
        });
        // Optionally typed, No need to worry about the fact that we convert this
        // and then TypeScript doesn't recignise that data type change
        var promise = new PayloadResponse_1.PayloadResponse(this.vortexService, new Payload_1.Payload(startFilt))
            .then(function (payload) { return payload.tuples; });
        return promise;
    };
    TupleDataObserverService.prototype.subscribeToTupleSelector = function (tupleSelector) {
        var _this = this;
        var tsStr = tupleSelector.toOrderedJsonStr();
        if (this.cacheByTupleSelector.hasOwnProperty(tsStr)) {
            var cachedData_1 = this.cacheByTupleSelector[tsStr];
            // Emit the data 2 miliseconds later.
            setTimeout(function () {
                _this.notifyObservers(cachedData_1, tupleSelector, cachedData_1.tuples);
            }, 2);
            return cachedData_1.subject;
        }
        var newCahcedData = new CachedSubscribedData();
        this.cacheByTupleSelector[tsStr] = newCahcedData;
        this.tellServerWeWantData([tupleSelector]);
        return newCahcedData.subject;
    };
    TupleDataObserverService.prototype.cleanupDeadCaches = function () {
        for (var _i = 0, _a = UtilMisc_1.dictKeysFromObject(this.cacheByTupleSelector); _i < _a.length; _i++) {
            var key = _a[_i];
            var cachedData = this.cacheByTupleSelector[key];
            if (cachedData.subject.observers.length == 0)
                delete this.cacheByTupleSelector[key];
        }
    };
    TupleDataObserverService.prototype.vortexOnlineChanged = function () {
        this.cleanupDeadCaches();
        var tupleSelectors = [];
        for (var _i = 0, _a = UtilMisc_1.dictKeysFromObject(this.cacheByTupleSelector); _i < _a.length; _i++) {
            var key = _a[_i];
            tupleSelectors.push(TupleSelector_1.TupleSelector.fromJsonStr(key));
        }
        this.tellServerWeWantData(tupleSelectors);
    };
    TupleDataObserverService.prototype.receivePayload = function (payload) {
        var tupleSelector = payload.filt.tupleSelector;
        var tsStr = tupleSelector.toOrderedJsonStr();
        if (!this.cacheByTupleSelector.hasOwnProperty(tsStr))
            return;
        var cachedData = this.cacheByTupleSelector[tsStr];
        cachedData.tuples = payload.tuples;
        cachedData.serverResponded = true;
        this.notifyObservers(cachedData, tupleSelector, payload.tuples);
    };
    TupleDataObserverService.prototype.notifyObservers = function (cachedData, tupleSelector, tuples) {
        try {
            cachedData.subject.next(tuples);
        }
        catch (e) {
            // NOTE: Observables automatically remove observers when the raise exceptions.
            console.log("ERROR: TupleDataObserverService.notifyObservers, observable has been removed\n            " + e.toString() + "\n            " + tupleSelector.toOrderedJsonStr());
        }
    };
    TupleDataObserverService.prototype.tellServerWeWantData = function (tupleSelectors) {
        if (!this.statusService.snapshot.isOnline)
            return;
        var startFilt = UtilMisc_1.extend({ "subscribe": true }, this.filt);
        var payloads = [];
        for (var _i = 0, tupleSelectors_1 = tupleSelectors; _i < tupleSelectors_1.length; _i++) {
            var tupleSelector = tupleSelectors_1[_i];
            var filt = UtilMisc_1.extend({}, startFilt, {
                "tupleSelector": tupleSelector
            });
            payloads.push(new Payload_1.Payload(filt));
        }
        this.vortexService.sendPayload(payloads);
    };
    TupleDataObserverService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [VortexService_1.VortexService,
            VortexStatusService_1.VortexStatusService,
            core_1.NgZone,
            TupleDataObservableNameService])
    ], TupleDataObserverService);
    return TupleDataObserverService;
}(ComponentLifecycleEventEmitter_1.ComponentLifecycleEventEmitter));
exports.TupleDataObserverService = TupleDataObserverService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHVwbGVEYXRhT2JzZXJ2ZXJTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiVHVwbGVEYXRhT2JzZXJ2ZXJTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQWlEO0FBQ2pELDZCQUE2QjtBQUM3QixpREFBOEM7QUFFOUMsaURBQThDO0FBQzlDLHFDQUFnRDtBQUNoRCxxREFBa0Q7QUFDbEQsbUZBQWdGO0FBQ2hGLHVDQUFzRDtBQUN0RCw2REFBMEQ7QUFDMUQscURBQWtEO0FBR2xEO0lBQ0ksd0NBQW1CLElBQVksRUFBUyxjQUFtQjtRQUFuQiwrQkFBQSxFQUFBLG1CQUFtQjtRQUF4QyxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQVMsbUJBQWMsR0FBZCxjQUFjLENBQUs7SUFFM0QsQ0FBQztJQUhRLDhCQUE4QjtRQUQxQyxpQkFBVSxFQUFFOztPQUNBLDhCQUE4QixDQUkxQztJQUFELHFDQUFDO0NBQUEsQUFKRCxJQUlDO0FBSlksd0VBQThCO0FBTTNDO0lBQUE7UUFDRSxZQUFPLEdBQW9CLElBQUksY0FBTyxFQUFXLENBQUM7UUFDbEQsV0FBTSxHQUFXLEVBQUUsQ0FBQztRQUNwQixvQkFBZSxHQUFHLEtBQUssQ0FBQztJQUMxQixDQUFDO0lBQUQsMkJBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQztBQUpZLG9EQUFvQjtBQU9qQztJQUE4Qyw0Q0FBOEI7SUFLeEUsa0NBQXNCLGFBQTRCLEVBQzVCLGFBQWtDLEVBQ2xDLElBQVksRUFDdEIsdUJBQXVEO1FBSG5FLFlBSUksaUJBQU8sU0FrQlY7UUF0QnFCLG1CQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLG1CQUFhLEdBQWIsYUFBYSxDQUFxQjtRQUNsQyxVQUFJLEdBQUosSUFBSSxDQUFRO1FBSnhCLDBCQUFvQixHQUFxRCxFQUFFLENBQUM7UUFRbEYsS0FBSSxDQUFDLElBQUksR0FBRyxpQkFBTSxDQUFDO1lBQ2YsTUFBTSxFQUFFLHVCQUF1QixDQUFDLElBQUk7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QixhQUFNO1lBQ0csOEJBQThCO09BUjFELHdCQUF3QixDQStIcEM7SUFBRCwrQkFBQztDQUFBLEFBL0hELENBQThDLCtEQUE4QixHQStIM0U7QUEvSFksNERBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlLCBOZ1pvbmV9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gXCJyeGpzXCI7XG5pbXBvcnQge1ZvcnRleFNlcnZpY2V9IGZyb20gXCIuL1ZvcnRleFNlcnZpY2VcIjtcbmltcG9ydCB7VHVwbGV9IGZyb20gXCIuL1R1cGxlXCI7XG5pbXBvcnQge1R1cGxlU2VsZWN0b3J9IGZyb20gXCIuL1R1cGxlU2VsZWN0b3JcIjtcbmltcG9ydCB7UGF5bG9hZCwgSVBheWxvYWRGaWx0fSBmcm9tIFwiLi9QYXlsb2FkXCI7XG5pbXBvcnQge1BheWxvYWRFbmRwb2ludH0gZnJvbSBcIi4vUGF5bG9hZEVuZHBvaW50XCI7XG5pbXBvcnQge0NvbXBvbmVudExpZmVjeWNsZUV2ZW50RW1pdHRlcn0gZnJvbSBcIi4vQ29tcG9uZW50TGlmZWN5Y2xlRXZlbnRFbWl0dGVyXCI7XG5pbXBvcnQge2V4dGVuZCwgZGljdEtleXNGcm9tT2JqZWN0fSBmcm9tIFwiLi9VdGlsTWlzY1wiO1xuaW1wb3J0IHtWb3J0ZXhTdGF0dXNTZXJ2aWNlfSBmcm9tIFwiLi9Wb3J0ZXhTdGF0dXNTZXJ2aWNlXCI7XG5pbXBvcnQge1BheWxvYWRSZXNwb25zZX0gZnJvbSBcIi4vUGF5bG9hZFJlc3BvbnNlXCI7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBUdXBsZURhdGFPYnNlcnZhYmxlTmFtZVNlcnZpY2Uge1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcsIHB1YmxpYyBhZGRpdGlvbmFsRmlsdCA9IHt9KSB7XG5cbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBDYWNoZWRTdWJzY3JpYmVkRGF0YSB7XG4gIHN1YmplY3Q6U3ViamVjdDxUdXBsZVtdPiA9IG5ldyBTdWJqZWN0PFR1cGxlW10+KCk7XG4gIHR1cGxlczpUdXBsZVtdID0gW107XG4gIHNlcnZlclJlc3BvbmRlZCA9IGZhbHNlO1xufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVHVwbGVEYXRhT2JzZXJ2ZXJTZXJ2aWNlIGV4dGVuZHMgQ29tcG9uZW50TGlmZWN5Y2xlRXZlbnRFbWl0dGVyIHtcbiAgICBwcm90ZWN0ZWQgZW5kcG9pbnQ6IFBheWxvYWRFbmRwb2ludDtcbiAgICBwcm90ZWN0ZWQgZmlsdDogSVBheWxvYWRGaWx0O1xuICAgIHByb3RlY3RlZCBjYWNoZUJ5VHVwbGVTZWxlY3RvcjogeyBbdHVwbGVTZWxlY3Rvcjogc3RyaW5nXTogQ2FjaGVkU3Vic2NyaWJlZERhdGF9ID0ge307XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgdm9ydGV4U2VydmljZTogVm9ydGV4U2VydmljZSxcbiAgICAgICAgICAgICAgICBwcm90ZWN0ZWQgc3RhdHVzU2VydmljZTogVm9ydGV4U3RhdHVzU2VydmljZSxcbiAgICAgICAgICAgICAgICBwcm90ZWN0ZWQgem9uZTogTmdab25lLFxuICAgICAgICAgICAgICAgIHR1cGxlRGF0YU9ic2VydmFibGVOYW1lOiBUdXBsZURhdGFPYnNlcnZhYmxlTmFtZVNlcnZpY2UpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLmZpbHQgPSBleHRlbmQoe1xuICAgICAgICAgICAgXCJuYW1lXCI6IHR1cGxlRGF0YU9ic2VydmFibGVOYW1lLm5hbWUsXG4gICAgICAgICAgICBcImtleVwiOiBcInR1cGxlRGF0YU9ic2VydmFibGVcIlxuICAgICAgICB9LCB0dXBsZURhdGFPYnNlcnZhYmxlTmFtZS5hZGRpdGlvbmFsRmlsdCk7XG5cbiAgICAgICAgdGhpcy5lbmRwb2ludCA9IG5ldyBQYXlsb2FkRW5kcG9pbnQodGhpcywgdGhpcy5maWx0KTtcbiAgICAgICAgdGhpcy5lbmRwb2ludC5vYnNlcnZhYmxlLnN1YnNjcmliZSgocGF5bG9hZCkgPT4gdGhpcy5yZWNlaXZlUGF5bG9hZChwYXlsb2FkKSk7XG5cbiAgICAgICAgc3RhdHVzU2VydmljZS5pc09ubGluZVxuICAgICAgICAgICAgLnRha2VVbnRpbCh0aGlzLm9uRGVzdHJveUV2ZW50KVxuICAgICAgICAgICAgLmZpbHRlcihvbmxpbmUgPT4gb25saW5lID09PSB0cnVlKVxuICAgICAgICAgICAgLnN1YnNjcmliZShvbmxpbmUgPT4gdGhpcy52b3J0ZXhPbmxpbmVDaGFuZ2VkKCkpO1xuXG4gICAgICAgIC8vIENsZWFudXAgZGVhZCBzdWJzY3JpYmVycyBldmVyeSAzMCBzZWNvbmRzLlxuICAgICAgICBsZXQgY2xlYW51cFRpbWVyID0gc2V0SW50ZXJ2YWwoKCkgPT4gdGhpcy5jbGVhbnVwRGVhZENhY2hlcygpLCAzMCk7XG4gICAgICAgIHRoaXMub25EZXN0cm95RXZlbnQuc3Vic2NyaWJlKCgpID0+IGNsZWFySW50ZXJ2YWwoY2xlYW51cFRpbWVyKSk7XG4gICAgfVxuXG4gICAgcG9sbEZvclR1cGxlcyh0dXBsZVNlbGVjdG9yOiBUdXBsZVNlbGVjdG9yKTogUHJvbWlzZTxUdXBsZVtdPiB7XG5cbiAgICAgICAgbGV0IHN0YXJ0RmlsdCA9IGV4dGVuZCh7XCJzdWJzY3JpYmVcIjogZmFsc2V9LCB0aGlzLmZpbHQsIHtcbiAgICAgICAgICAgIFwidHVwbGVTZWxlY3RvclwiOiB0dXBsZVNlbGVjdG9yXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIE9wdGlvbmFsbHkgdHlwZWQsIE5vIG5lZWQgdG8gd29ycnkgYWJvdXQgdGhlIGZhY3QgdGhhdCB3ZSBjb252ZXJ0IHRoaXNcbiAgICAgICAgLy8gYW5kIHRoZW4gVHlwZVNjcmlwdCBkb2Vzbid0IHJlY2lnbmlzZSB0aGF0IGRhdGEgdHlwZSBjaGFuZ2VcbiAgICAgICAgbGV0IHByb21pc2U6IGFueSA9IG5ldyBQYXlsb2FkUmVzcG9uc2UodGhpcy52b3J0ZXhTZXJ2aWNlLCBuZXcgUGF5bG9hZChzdGFydEZpbHQpKVxuICAgICAgICAgICAgLnRoZW4ocGF5bG9hZCA9PiBwYXlsb2FkLnR1cGxlcyk7XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cblxuICAgIHN1YnNjcmliZVRvVHVwbGVTZWxlY3Rvcih0dXBsZVNlbGVjdG9yOiBUdXBsZVNlbGVjdG9yKTogU3ViamVjdDxUdXBsZVtdPiB7XG5cbiAgICAgICAgbGV0IHRzU3RyID0gdHVwbGVTZWxlY3Rvci50b09yZGVyZWRKc29uU3RyKCk7XG4gICAgICAgIGlmICh0aGlzLmNhY2hlQnlUdXBsZVNlbGVjdG9yLmhhc093blByb3BlcnR5KHRzU3RyKSkge1xuICAgICAgICAgICAgbGV0IGNhY2hlZERhdGEgPSB0aGlzLmNhY2hlQnlUdXBsZVNlbGVjdG9yW3RzU3RyXTtcblxuICAgICAgICAgICAgLy8gRW1pdCB0aGUgZGF0YSAyIG1pbGlzZWNvbmRzIGxhdGVyLlxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5ub3RpZnlPYnNlcnZlcnMoY2FjaGVkRGF0YSwgdHVwbGVTZWxlY3RvciwgY2FjaGVkRGF0YS50dXBsZXMpO1xuICAgICAgICAgICAgfSwgMik7XG5cbiAgICAgICAgICAgIHJldHVybiBjYWNoZWREYXRhLnN1YmplY3Q7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbmV3Q2FoY2VkRGF0YSA9IG5ldyBDYWNoZWRTdWJzY3JpYmVkRGF0YSgpO1xuICAgICAgICB0aGlzLmNhY2hlQnlUdXBsZVNlbGVjdG9yW3RzU3RyXSA9IG5ld0NhaGNlZERhdGE7XG5cbiAgICAgICAgdGhpcy50ZWxsU2VydmVyV2VXYW50RGF0YShbdHVwbGVTZWxlY3Rvcl0pO1xuXG4gICAgICAgIHJldHVybiBuZXdDYWhjZWREYXRhLnN1YmplY3Q7XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIGNsZWFudXBEZWFkQ2FjaGVzKCkgOnZvaWQge1xuICAgICAgICBmb3IgKGxldCBrZXkgb2YgZGljdEtleXNGcm9tT2JqZWN0KHRoaXMuY2FjaGVCeVR1cGxlU2VsZWN0b3IpKSB7XG4gICAgICAgICAgICBsZXQgY2FjaGVkRGF0YSA9IHRoaXMuY2FjaGVCeVR1cGxlU2VsZWN0b3Jba2V5XTtcbiAgICAgICAgICAgIGlmIChjYWNoZWREYXRhLnN1YmplY3Qub2JzZXJ2ZXJzLmxlbmd0aCA9PSAwKVxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmNhY2hlQnlUdXBsZVNlbGVjdG9yW2tleV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgdm9ydGV4T25saW5lQ2hhbmdlZCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jbGVhbnVwRGVhZENhY2hlcygpO1xuICAgICAgICBsZXQgdHVwbGVTZWxlY3RvcnM6IFR1cGxlU2VsZWN0b3JbXSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBrZXkgb2YgZGljdEtleXNGcm9tT2JqZWN0KHRoaXMuY2FjaGVCeVR1cGxlU2VsZWN0b3IpKSB7XG4gICAgICAgICAgICB0dXBsZVNlbGVjdG9ycy5wdXNoKFR1cGxlU2VsZWN0b3IuZnJvbUpzb25TdHIoa2V5KSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50ZWxsU2VydmVyV2VXYW50RGF0YSh0dXBsZVNlbGVjdG9ycyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlY2VpdmVQYXlsb2FkKHBheWxvYWQpOiB2b2lkIHtcbiAgICAgICAgbGV0IHR1cGxlU2VsZWN0b3IgPSBwYXlsb2FkLmZpbHQudHVwbGVTZWxlY3RvcjtcbiAgICAgICAgbGV0IHRzU3RyID0gdHVwbGVTZWxlY3Rvci50b09yZGVyZWRKc29uU3RyKCk7XG5cbiAgICAgICAgaWYgKCF0aGlzLmNhY2hlQnlUdXBsZVNlbGVjdG9yLmhhc093blByb3BlcnR5KHRzU3RyKSlcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBsZXQgY2FjaGVkRGF0YSA9IHRoaXMuY2FjaGVCeVR1cGxlU2VsZWN0b3JbdHNTdHJdO1xuICAgICAgICBjYWNoZWREYXRhLnR1cGxlcyA9IHBheWxvYWQudHVwbGVzO1xuICAgICAgICBjYWNoZWREYXRhLnNlcnZlclJlc3BvbmRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMubm90aWZ5T2JzZXJ2ZXJzKGNhY2hlZERhdGEsIHR1cGxlU2VsZWN0b3IsIHBheWxvYWQudHVwbGVzKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbm90aWZ5T2JzZXJ2ZXJzKGNhY2hlZERhdGE6IENhY2hlZFN1YnNjcmliZWREYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHVwbGVTZWxlY3RvcjogVHVwbGVTZWxlY3RvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR1cGxlczogVHVwbGVbXSk6IHZvaWQge1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjYWNoZWREYXRhLnN1YmplY3QubmV4dCh0dXBsZXMpO1xuXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8vIE5PVEU6IE9ic2VydmFibGVzIGF1dG9tYXRpY2FsbHkgcmVtb3ZlIG9ic2VydmVycyB3aGVuIHRoZSByYWlzZSBleGNlcHRpb25zLlxuICAgICAgICAgICAgY29uc29sZS5sb2coYEVSUk9SOiBUdXBsZURhdGFPYnNlcnZlclNlcnZpY2Uubm90aWZ5T2JzZXJ2ZXJzLCBvYnNlcnZhYmxlIGhhcyBiZWVuIHJlbW92ZWRcbiAgICAgICAgICAgICR7ZS50b1N0cmluZygpfVxuICAgICAgICAgICAgJHt0dXBsZVNlbGVjdG9yLnRvT3JkZXJlZEpzb25TdHIoKX1gKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHRlbGxTZXJ2ZXJXZVdhbnREYXRhKHR1cGxlU2VsZWN0b3JzOiBUdXBsZVNlbGVjdG9yW10pOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLnN0YXR1c1NlcnZpY2Uuc25hcHNob3QuaXNPbmxpbmUpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgbGV0IHN0YXJ0RmlsdCA9IGV4dGVuZCh7XCJzdWJzY3JpYmVcIjogdHJ1ZX0sIHRoaXMuZmlsdCk7XG5cbiAgICAgICAgbGV0IHBheWxvYWRzOiBQYXlsb2FkW10gPSBbXTtcbiAgICAgICAgZm9yIChsZXQgdHVwbGVTZWxlY3RvciBvZiB0dXBsZVNlbGVjdG9ycykge1xuICAgICAgICAgICAgbGV0IGZpbHQgPSBleHRlbmQoe30sIHN0YXJ0RmlsdCwge1xuICAgICAgICAgICAgICAgIFwidHVwbGVTZWxlY3RvclwiOiB0dXBsZVNlbGVjdG9yXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcGF5bG9hZHMucHVzaChuZXcgUGF5bG9hZChmaWx0KSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy52b3J0ZXhTZXJ2aWNlLnNlbmRQYXlsb2FkKHBheWxvYWRzKTtcbiAgICB9XG59XG5cbiJdfQ==