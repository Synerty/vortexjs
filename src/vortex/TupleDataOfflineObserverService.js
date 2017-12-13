"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var VortexService_1 = require("./VortexService");
var VortexStatusService_1 = require("./VortexStatusService");
var TupleOfflineStorageService_1 = require("./TupleOfflineStorageService");
var TupleDataObserverService_1 = require("./TupleDataObserverService");
var TupleDataOfflineObserverService = (function (_super) {
    __extends(TupleDataOfflineObserverService, _super);
    function TupleDataOfflineObserverService(vortexService, vortexStatusService, zone, tupleDataObservableName, tupleOfflineStorageService) {
        var _this = _super.call(this, vortexService, vortexStatusService, zone, tupleDataObservableName) || this;
        _this.tupleOfflineStorageService = tupleOfflineStorageService;
        return _this;
    }
    TupleDataOfflineObserverService.prototype.subscribeToTupleSelector = function (tupleSelector) {
        var _this = this;
        var tsStr = tupleSelector.toOrderedJsonStr();
        if (this.cacheByTupleSelector.hasOwnProperty(tsStr)) {
            var cachedData_1 = this.cacheByTupleSelector[tsStr];
            // Emit the data 2 miliseconds later.
            setTimeout(function () {
                _super.prototype.notifyObservers.call(_this, cachedData_1, tupleSelector, cachedData_1.tuples);
            }, 2);
            return cachedData_1.subject;
        }
        var newCahcedData = new TupleDataObserverService_1.CachedSubscribedData();
        this.cacheByTupleSelector[tsStr] = newCahcedData;
        this.tellServerWeWantData([tupleSelector]);
        this.tupleOfflineStorageService
            .loadTuples(tupleSelector)
            .then(function (tuples) {
            // If the server has responded before we loaded the data, then just
            // ignore the cached data.
            if (newCahcedData.serverResponded)
                return;
            // Update the tuples, and notify if them
            newCahcedData.tuples = tuples;
            _super.prototype.notifyObservers.call(_this, newCahcedData, tupleSelector, tuples);
        })
            .catch(function (err) {
            _this.statusService.logError("loadTuples failed : " + err);
            throw new Error(err);
        });
        return newCahcedData.subject;
    };
    /** Update Offline State
     *
     * This method updates the offline stored data, which will be used until the next
     * update from the server comes along.
     * @param tupleSelector: The tuple selector to update tuples for
     * @param tuples: The new data to store
     */
    TupleDataOfflineObserverService.prototype.updateOfflineState = function (tupleSelector, tuples) {
        var tsStr = tupleSelector.toOrderedJsonStr();
        if (!this.cacheByTupleSelector.hasOwnProperty(tsStr)) {
            console.log("ERROR: updateOfflineState called with no subscribers");
            return;
        }
        var cachedData = this.cacheByTupleSelector[tsStr];
        this.notifyObservers(cachedData, tupleSelector, tuples);
    };
    TupleDataOfflineObserverService.prototype.notifyObservers = function (cachedData, tupleSelector, tuples) {
        var _this = this;
        // Pass the data on
        _super.prototype.notifyObservers.call(this, cachedData, tupleSelector, tuples);
        // AND store the data locally
        this.tupleOfflineStorageService.saveTuples(tupleSelector, tuples)
            .catch(function (err) {
            _this.statusService.logError("saveTuples failed : " + err);
            throw new Error(err);
        });
    };
    TupleDataOfflineObserverService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [VortexService_1.VortexService,
            VortexStatusService_1.VortexStatusService,
            core_1.NgZone,
            TupleDataObserverService_1.TupleDataObservableNameService,
            TupleOfflineStorageService_1.TupleOfflineStorageService])
    ], TupleDataOfflineObserverService);
    return TupleDataOfflineObserverService;
}(TupleDataObserverService_1.TupleDataObserverService));
exports.TupleDataOfflineObserverService = TupleDataOfflineObserverService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHVwbGVEYXRhT2ZmbGluZU9ic2VydmVyU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlR1cGxlRGF0YU9mZmxpbmVPYnNlcnZlclNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBaUQ7QUFFakQsaURBQThDO0FBRzlDLDZEQUEwRDtBQUMxRCwyRUFBd0U7QUFDeEUsdUVBSW9DO0FBSXBDO0lBQXFELG1EQUF3QjtJQUV6RSx5Q0FBWSxhQUE0QixFQUM1QixtQkFBd0MsRUFDeEMsSUFBWSxFQUNaLHVCQUF1RCxFQUMvQywwQkFBc0Q7UUFKMUUsWUFLSSxrQkFBTSxhQUFhLEVBQUUsbUJBQW1CLEVBQUUsSUFBSSxFQUFFLHVCQUF1QixDQUFDLFNBRTNFO1FBSG1CLGdDQUEwQixHQUExQiwwQkFBMEIsQ0FBNEI7O0lBRzFFLENBQUM7SUFFRCxrRUFBd0IsR0FBeEIsVUFBeUIsYUFBNEI7UUFBckQsaUJBc0NDO1FBcENHLElBQUksS0FBSyxHQUFHLGFBQWEsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBRTdDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xELElBQUksWUFBVSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUVsRCxxQ0FBcUM7WUFDckMsVUFBVSxDQUFDO2dCQUNQLGlCQUFNLGVBQWUsYUFBQyxZQUFVLEVBQUUsYUFBYSxFQUFFLFlBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN4RSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFFTixNQUFNLENBQUMsWUFBVSxDQUFDLE9BQU8sQ0FBQztRQUM5QixDQUFDO1FBRUQsSUFBSSxhQUFhLEdBQUcsSUFBSSwrQ0FBb0IsRUFBRSxDQUFDO1FBQy9DLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsR0FBRyxhQUFhLENBQUM7UUFFakQsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUUzQyxJQUFJLENBQUMsMEJBQTBCO2FBQzVCLFVBQVUsQ0FBQyxhQUFhLENBQUM7YUFDdkIsSUFBSSxDQUFDLFVBQUMsTUFBZTtZQUNuQixtRUFBbUU7WUFDbkUsMEJBQTBCO1lBQzFCLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUM7Z0JBQ2hDLE1BQU0sQ0FBQztZQUVULHdDQUF3QztZQUN4QyxhQUFhLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztZQUM5QixpQkFBTSxlQUFlLGFBQUMsYUFBYSxFQUFFLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMvRCxDQUFDLENBQUM7YUFDRCxLQUFLLENBQUMsVUFBQSxHQUFHO1lBQ04sS0FBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMseUJBQXVCLEdBQUssQ0FBQyxDQUFDO1lBQzFELE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDekIsQ0FBQyxDQUFDLENBQUM7UUFFUCxNQUFNLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQztJQUNqQyxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsNERBQWtCLEdBQWxCLFVBQW1CLGFBQTRCLEVBQUUsTUFBZTtRQUM1RCxJQUFJLEtBQUssR0FBRyxhQUFhLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUM3QyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JELE9BQU8sQ0FBQyxHQUFHLENBQUMsc0RBQXNELENBQUMsQ0FBQztZQUNwRSxNQUFNLENBQUM7UUFDVCxDQUFDO1FBRUQsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRVMseURBQWUsR0FBekIsVUFBMEIsVUFBZ0MsRUFDaEMsYUFBNEIsRUFDNUIsTUFBZTtRQUZ6QyxpQkFZQztRQVRHLG1CQUFtQjtRQUNuQixpQkFBTSxlQUFlLFlBQUMsVUFBVSxFQUFFLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUV6RCw2QkFBNkI7UUFDN0IsSUFBSSxDQUFDLDBCQUEwQixDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDO2FBQzVELEtBQUssQ0FBQyxVQUFBLEdBQUc7WUFDTixLQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyx5QkFBdUIsR0FBSyxDQUFDLENBQUM7WUFDMUQsTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN6QixDQUFDLENBQUMsQ0FBQztJQUNYLENBQUM7SUFqRlEsK0JBQStCO1FBRDNDLGlCQUFVLEVBQUU7eUNBR2tCLDZCQUFhO1lBQ1AseUNBQW1CO1lBQ2xDLGFBQU07WUFDYSx5REFBOEI7WUFDbkIsdURBQTBCO09BTmpFLCtCQUErQixDQWtGM0M7SUFBRCxzQ0FBQztDQUFBLEFBbEZELENBQXFELG1EQUF3QixHQWtGNUU7QUFsRlksMEVBQStCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlLCBOZ1pvbmV9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gXCJyeGpzXCI7XG5pbXBvcnQge1ZvcnRleFNlcnZpY2V9IGZyb20gXCIuL1ZvcnRleFNlcnZpY2VcIjtcbmltcG9ydCB7VHVwbGV9IGZyb20gXCIuL1R1cGxlXCI7XG5pbXBvcnQge1R1cGxlU2VsZWN0b3J9IGZyb20gXCIuL1R1cGxlU2VsZWN0b3JcIjtcbmltcG9ydCB7Vm9ydGV4U3RhdHVzU2VydmljZX0gZnJvbSBcIi4vVm9ydGV4U3RhdHVzU2VydmljZVwiO1xuaW1wb3J0IHtUdXBsZU9mZmxpbmVTdG9yYWdlU2VydmljZX0gZnJvbSBcIi4vVHVwbGVPZmZsaW5lU3RvcmFnZVNlcnZpY2VcIjtcbmltcG9ydCB7XG4gICAgVHVwbGVEYXRhT2JzZXJ2YWJsZU5hbWVTZXJ2aWNlLFxuICAgIFR1cGxlRGF0YU9ic2VydmVyU2VydmljZSxcbiAgICBDYWNoZWRTdWJzY3JpYmVkRGF0YVxufSBmcm9tIFwiLi9UdXBsZURhdGFPYnNlcnZlclNlcnZpY2VcIjtcblxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVHVwbGVEYXRhT2ZmbGluZU9ic2VydmVyU2VydmljZSBleHRlbmRzIFR1cGxlRGF0YU9ic2VydmVyU2VydmljZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcih2b3J0ZXhTZXJ2aWNlOiBWb3J0ZXhTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHZvcnRleFN0YXR1c1NlcnZpY2U6IFZvcnRleFN0YXR1c1NlcnZpY2UsXG4gICAgICAgICAgICAgICAgem9uZTogTmdab25lLFxuICAgICAgICAgICAgICAgIHR1cGxlRGF0YU9ic2VydmFibGVOYW1lOiBUdXBsZURhdGFPYnNlcnZhYmxlTmFtZVNlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSB0dXBsZU9mZmxpbmVTdG9yYWdlU2VydmljZTogVHVwbGVPZmZsaW5lU3RvcmFnZVNlcnZpY2UpIHtcbiAgICAgICAgc3VwZXIodm9ydGV4U2VydmljZSwgdm9ydGV4U3RhdHVzU2VydmljZSwgem9uZSwgdHVwbGVEYXRhT2JzZXJ2YWJsZU5hbWUpO1xuXG4gICAgfVxuXG4gICAgc3Vic2NyaWJlVG9UdXBsZVNlbGVjdG9yKHR1cGxlU2VsZWN0b3I6IFR1cGxlU2VsZWN0b3IpOiBTdWJqZWN0PFR1cGxlW10+IHtcblxuICAgICAgICBsZXQgdHNTdHIgPSB0dXBsZVNlbGVjdG9yLnRvT3JkZXJlZEpzb25TdHIoKTtcblxuICAgICAgICBpZiAodGhpcy5jYWNoZUJ5VHVwbGVTZWxlY3Rvci5oYXNPd25Qcm9wZXJ0eSh0c1N0cikpIHtcbiAgICAgICAgICAgIGxldCBjYWNoZWREYXRhID0gdGhpcy5jYWNoZUJ5VHVwbGVTZWxlY3Rvclt0c1N0cl07XG5cbiAgICAgICAgICAgIC8vIEVtaXQgdGhlIGRhdGEgMiBtaWxpc2Vjb25kcyBsYXRlci5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHN1cGVyLm5vdGlmeU9ic2VydmVycyhjYWNoZWREYXRhLCB0dXBsZVNlbGVjdG9yLCBjYWNoZWREYXRhLnR1cGxlcyk7XG4gICAgICAgICAgICB9LCAyKTtcblxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZERhdGEuc3ViamVjdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBuZXdDYWhjZWREYXRhID0gbmV3IENhY2hlZFN1YnNjcmliZWREYXRhKCk7XG4gICAgICAgIHRoaXMuY2FjaGVCeVR1cGxlU2VsZWN0b3JbdHNTdHJdID0gbmV3Q2FoY2VkRGF0YTtcblxuICAgICAgICB0aGlzLnRlbGxTZXJ2ZXJXZVdhbnREYXRhKFt0dXBsZVNlbGVjdG9yXSk7XG5cbiAgICAgICAgdGhpcy50dXBsZU9mZmxpbmVTdG9yYWdlU2VydmljZVxuICAgICAgICAgIC5sb2FkVHVwbGVzKHR1cGxlU2VsZWN0b3IpXG4gICAgICAgICAgICAudGhlbigodHVwbGVzOiBUdXBsZVtdKSA9PiB7XG4gICAgICAgICAgICAgICAvLyBJZiB0aGUgc2VydmVyIGhhcyByZXNwb25kZWQgYmVmb3JlIHdlIGxvYWRlZCB0aGUgZGF0YSwgdGhlbiBqdXN0XG4gICAgICAgICAgICAgICAvLyBpZ25vcmUgdGhlIGNhY2hlZCBkYXRhLlxuICAgICAgICAgICAgICAgaWYgKG5ld0NhaGNlZERhdGEuc2VydmVyUmVzcG9uZGVkKVxuICAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgdHVwbGVzLCBhbmQgbm90aWZ5IGlmIHRoZW1cbiAgICAgICAgICAgICAgIG5ld0NhaGNlZERhdGEudHVwbGVzID0gdHVwbGVzO1xuICAgICAgICAgICAgICAgc3VwZXIubm90aWZ5T2JzZXJ2ZXJzKG5ld0NhaGNlZERhdGEsIHR1cGxlU2VsZWN0b3IsIHR1cGxlcyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0dXNTZXJ2aWNlLmxvZ0Vycm9yKGBsb2FkVHVwbGVzIGZhaWxlZCA6ICR7ZXJyfWApO1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnIpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIG5ld0NhaGNlZERhdGEuc3ViamVjdDtcbiAgICB9XG5cbiAgICAvKiogVXBkYXRlIE9mZmxpbmUgU3RhdGVcbiAgICAgKlxuICAgICAqIFRoaXMgbWV0aG9kIHVwZGF0ZXMgdGhlIG9mZmxpbmUgc3RvcmVkIGRhdGEsIHdoaWNoIHdpbGwgYmUgdXNlZCB1bnRpbCB0aGUgbmV4dFxuICAgICAqIHVwZGF0ZSBmcm9tIHRoZSBzZXJ2ZXIgY29tZXMgYWxvbmcuXG4gICAgICogQHBhcmFtIHR1cGxlU2VsZWN0b3I6IFRoZSB0dXBsZSBzZWxlY3RvciB0byB1cGRhdGUgdHVwbGVzIGZvclxuICAgICAqIEBwYXJhbSB0dXBsZXM6IFRoZSBuZXcgZGF0YSB0byBzdG9yZVxuICAgICAqL1xuICAgIHVwZGF0ZU9mZmxpbmVTdGF0ZSh0dXBsZVNlbGVjdG9yOiBUdXBsZVNlbGVjdG9yLCB0dXBsZXM6IFR1cGxlW10pOiB2b2lkIHtcbiAgICAgICAgbGV0IHRzU3RyID0gdHVwbGVTZWxlY3Rvci50b09yZGVyZWRKc29uU3RyKCk7XG4gICAgICAgIGlmICghdGhpcy5jYWNoZUJ5VHVwbGVTZWxlY3Rvci5oYXNPd25Qcm9wZXJ0eSh0c1N0cikpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkVSUk9SOiB1cGRhdGVPZmZsaW5lU3RhdGUgY2FsbGVkIHdpdGggbm8gc3Vic2NyaWJlcnNcIik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNhY2hlZERhdGEgPSB0aGlzLmNhY2hlQnlUdXBsZVNlbGVjdG9yW3RzU3RyXTtcbiAgICAgICAgdGhpcy5ub3RpZnlPYnNlcnZlcnMoY2FjaGVkRGF0YSwgdHVwbGVTZWxlY3RvciwgdHVwbGVzKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgbm90aWZ5T2JzZXJ2ZXJzKGNhY2hlZERhdGE6IENhY2hlZFN1YnNjcmliZWREYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHVwbGVTZWxlY3RvcjogVHVwbGVTZWxlY3RvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR1cGxlczogVHVwbGVbXSk6IHZvaWQge1xuICAgICAgICAvLyBQYXNzIHRoZSBkYXRhIG9uXG4gICAgICAgIHN1cGVyLm5vdGlmeU9ic2VydmVycyhjYWNoZWREYXRhLCB0dXBsZVNlbGVjdG9yLCB0dXBsZXMpO1xuXG4gICAgICAgIC8vIEFORCBzdG9yZSB0aGUgZGF0YSBsb2NhbGx5XG4gICAgICAgIHRoaXMudHVwbGVPZmZsaW5lU3RvcmFnZVNlcnZpY2Uuc2F2ZVR1cGxlcyh0dXBsZVNlbGVjdG9yLCB0dXBsZXMpXG4gICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXR1c1NlcnZpY2UubG9nRXJyb3IoYHNhdmVUdXBsZXMgZmFpbGVkIDogJHtlcnJ9YCk7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG59XG5cbiJdfQ==