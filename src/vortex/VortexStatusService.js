"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Subject_1 = require("rxjs/Subject");
var UtilMisc_1 = require("./UtilMisc");
// Node compatibility
var logDebug = console.debug ? UtilMisc_1.bind(console, console.debug) : UtilMisc_1.bind(console, console.log);
var logInfo = UtilMisc_1.bind(console, console.log);
var logError = console.error ? UtilMisc_1.bind(console, console.error) : UtilMisc_1.bind(console, console.log);
var VortexStatusService = (function () {
    function VortexStatusService(zone) {
        this.zone = zone;
        this.isOnline = new Subject_1.Subject();
        this.info = new Subject_1.Subject();
        this.errors = new Subject_1.Subject();
        this.wasOnline = false;
        this.queuedActionCount = new Subject_1.Subject();
        this.lastQueuedTupleActions = 0;
    }
    Object.defineProperty(VortexStatusService.prototype, "snapshot", {
        get: function () {
            return {
                isOnline: this.wasOnline,
                queuedActionCount: this.lastQueuedTupleActions
            };
        },
        enumerable: true,
        configurable: true
    });
    VortexStatusService.prototype.setOnline = function (online) {
        var _this = this;
        if (online === this.wasOnline)
            return;
        logDebug(UtilMisc_1.dateStr() + "Vortex Status - online: " + online);
        this.wasOnline = online;
        this.zone.run(function () {
            _this.isOnline.next(online);
        });
    };
    VortexStatusService.prototype.incrementQueuedActionCount = function () {
        this.setQueuedActionCount(this.lastQueuedTupleActions + 1);
    };
    VortexStatusService.prototype.decrementQueuedActionCount = function () {
        this.setQueuedActionCount(this.lastQueuedTupleActions - 1);
    };
    VortexStatusService.prototype.setQueuedActionCount = function (count) {
        var _this = this;
        if (count === this.lastQueuedTupleActions)
            return;
        this.lastQueuedTupleActions = count;
        this.zone.run(function () {
            _this.queuedActionCount.next(count);
        });
    };
    VortexStatusService.prototype.logInfo = function (message) {
        var _this = this;
        logInfo(UtilMisc_1.dateStr() + "Vortex Status - info: " + message);
        this.zone.run(function () {
            _this.info.next(message);
        });
    };
    VortexStatusService.prototype.logError = function (message) {
        var _this = this;
        logError(UtilMisc_1.dateStr() + "Vortex Status - error: " + message);
        this.zone.run(function () {
            _this.errors.next(message);
        });
    };
    VortexStatusService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [core_1.NgZone])
    ], VortexStatusService);
    return VortexStatusService;
}());
exports.VortexStatusService = VortexStatusService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVm9ydGV4U3RhdHVzU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlZvcnRleFN0YXR1c1NlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBaUQ7QUFDakQsd0NBQXFDO0FBQ3JDLHVDQUF5QztBQUV6QyxxQkFBcUI7QUFDckIsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLEtBQUssR0FBRyxlQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxlQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN6RixJQUFJLE9BQU8sR0FBRyxlQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN6QyxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsS0FBSyxHQUFHLGVBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLGVBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBUXpGO0lBUUksNkJBQW9CLElBQVk7UUFBWixTQUFJLEdBQUosSUFBSSxDQUFRO1FBTmhDLGFBQVEsR0FBcUIsSUFBSSxpQkFBTyxFQUFXLENBQUM7UUFDcEQsU0FBSSxHQUFvQixJQUFJLGlCQUFPLEVBQVUsQ0FBQztRQUM5QyxXQUFNLEdBQW9CLElBQUksaUJBQU8sRUFBVSxDQUFDO1FBRXhDLGNBQVMsR0FBWSxLQUFLLENBQUM7UUEwQm5DLHNCQUFpQixHQUFvQixJQUFJLGlCQUFPLEVBQVUsQ0FBQztRQUMzRCwyQkFBc0IsR0FBVyxDQUFDLENBQUM7SUF2Qm5DLENBQUM7SUFFRCxzQkFBSSx5Q0FBUTthQUFaO1lBQ0ksTUFBTSxDQUFDO2dCQUNILFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUztnQkFDeEIsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLHNCQUFzQjthQUNqRCxDQUFDO1FBQ04sQ0FBQzs7O09BQUE7SUFFRCx1Q0FBUyxHQUFULFVBQVUsTUFBZTtRQUF6QixpQkFVQztRQVRHLEVBQUUsQ0FBQyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQzFCLE1BQU0sQ0FBQztRQUVYLFFBQVEsQ0FBQyxrQkFBTyxFQUFFLEdBQUcsMEJBQTBCLEdBQUcsTUFBTSxDQUFDLENBQUM7UUFFMUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7UUFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7WUFDVixLQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFNRCx3REFBMEIsR0FBMUI7UUFDSSxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLHNCQUFzQixHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRCx3REFBMEIsR0FBMUI7UUFDSSxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLHNCQUFzQixHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRCxrREFBb0IsR0FBcEIsVUFBcUIsS0FBYTtRQUFsQyxpQkFRQztRQVBHLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsc0JBQXNCLENBQUM7WUFDdEMsTUFBTSxDQUFDO1FBRVgsSUFBSSxDQUFDLHNCQUFzQixHQUFHLEtBQUssQ0FBQztRQUNwQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztZQUNWLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQscUNBQU8sR0FBUCxVQUFRLE9BQWU7UUFBdkIsaUJBS0M7UUFKRyxPQUFPLENBQUMsa0JBQU8sRUFBRSxHQUFHLHdCQUF3QixHQUFHLE9BQU8sQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1lBQ1YsS0FBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsc0NBQVEsR0FBUixVQUFTLE9BQWU7UUFBeEIsaUJBS0M7UUFKRyxRQUFRLENBQUMsa0JBQU8sRUFBRSxHQUFHLHlCQUF5QixHQUFHLE9BQU8sQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1lBQ1YsS0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBakVRLG1CQUFtQjtRQUQvQixpQkFBVSxFQUFFO3lDQVNpQixhQUFNO09BUnZCLG1CQUFtQixDQW1FL0I7SUFBRCwwQkFBQztDQUFBLEFBbkVELElBbUVDO0FBbkVZLGtEQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZSwgTmdab25lfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tIFwicnhqcy9TdWJqZWN0XCI7XG5pbXBvcnQge2RhdGVTdHIsIGJpbmR9IGZyb20gXCIuL1V0aWxNaXNjXCI7XG5cbi8vIE5vZGUgY29tcGF0aWJpbGl0eVxubGV0IGxvZ0RlYnVnID0gY29uc29sZS5kZWJ1ZyA/IGJpbmQoY29uc29sZSwgY29uc29sZS5kZWJ1ZykgOiBiaW5kKGNvbnNvbGUsIGNvbnNvbGUubG9nKTtcbmxldCBsb2dJbmZvID0gYmluZChjb25zb2xlLCBjb25zb2xlLmxvZyk7XG5sZXQgbG9nRXJyb3IgPSBjb25zb2xlLmVycm9yID8gYmluZChjb25zb2xlLCBjb25zb2xlLmVycm9yKSA6IGJpbmQoY29uc29sZSwgY29uc29sZS5sb2cpO1xuXG5leHBvcnQgaW50ZXJmYWNlIFZvcnRleFN0YXR1c1NlcnZpY2VTbmFwc2hvdCB7XG4gICAgaXNPbmxpbmU6IGJvb2xlYW47XG4gICAgcXVldWVkQWN0aW9uQ291bnQ6IG51bWJlcjtcbn1cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFZvcnRleFN0YXR1c1NlcnZpY2Uge1xuXG4gICAgaXNPbmxpbmU6IFN1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuICAgIGluZm86IFN1YmplY3Q8c3RyaW5nPiA9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcbiAgICBlcnJvcnM6IFN1YmplY3Q8c3RyaW5nPiA9IG5ldyBTdWJqZWN0PHN0cmluZz4oKTtcblxuICAgIHByaXZhdGUgd2FzT25saW5lOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHpvbmU6IE5nWm9uZSkge1xuXG4gICAgfVxuXG4gICAgZ2V0IHNuYXBzaG90KCk6IFZvcnRleFN0YXR1c1NlcnZpY2VTbmFwc2hvdCB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpc09ubGluZTogdGhpcy53YXNPbmxpbmUsXG4gICAgICAgICAgICBxdWV1ZWRBY3Rpb25Db3VudDogdGhpcy5sYXN0UXVldWVkVHVwbGVBY3Rpb25zXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgc2V0T25saW5lKG9ubGluZTogYm9vbGVhbikge1xuICAgICAgICBpZiAob25saW5lID09PSB0aGlzLndhc09ubGluZSlcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBsb2dEZWJ1ZyhkYXRlU3RyKCkgKyBcIlZvcnRleCBTdGF0dXMgLSBvbmxpbmU6IFwiICsgb25saW5lKTtcblxuICAgICAgICB0aGlzLndhc09ubGluZSA9IG9ubGluZTtcbiAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmlzT25saW5lLm5leHQob25saW5lKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICBxdWV1ZWRBY3Rpb25Db3VudDogU3ViamVjdDxudW1iZXI+ID0gbmV3IFN1YmplY3Q8bnVtYmVyPigpO1xuICAgIGxhc3RRdWV1ZWRUdXBsZUFjdGlvbnM6IG51bWJlciA9IDA7XG5cbiAgICBpbmNyZW1lbnRRdWV1ZWRBY3Rpb25Db3VudCgpIHtcbiAgICAgICAgdGhpcy5zZXRRdWV1ZWRBY3Rpb25Db3VudCh0aGlzLmxhc3RRdWV1ZWRUdXBsZUFjdGlvbnMgKyAxKTtcbiAgICB9XG5cbiAgICBkZWNyZW1lbnRRdWV1ZWRBY3Rpb25Db3VudCgpIHtcbiAgICAgICAgdGhpcy5zZXRRdWV1ZWRBY3Rpb25Db3VudCh0aGlzLmxhc3RRdWV1ZWRUdXBsZUFjdGlvbnMgLSAxKTtcbiAgICB9XG5cbiAgICBzZXRRdWV1ZWRBY3Rpb25Db3VudChjb3VudDogbnVtYmVyKSB7XG4gICAgICAgIGlmIChjb3VudCA9PT0gdGhpcy5sYXN0UXVldWVkVHVwbGVBY3Rpb25zKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMubGFzdFF1ZXVlZFR1cGxlQWN0aW9ucyA9IGNvdW50O1xuICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucXVldWVkQWN0aW9uQ291bnQubmV4dChjb3VudCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGxvZ0luZm8obWVzc2FnZTogc3RyaW5nKSB7XG4gICAgICAgIGxvZ0luZm8oZGF0ZVN0cigpICsgXCJWb3J0ZXggU3RhdHVzIC0gaW5mbzogXCIgKyBtZXNzYWdlKTtcbiAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmluZm8ubmV4dChtZXNzYWdlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbG9nRXJyb3IobWVzc2FnZTogc3RyaW5nKSB7XG4gICAgICAgIGxvZ0Vycm9yKGRhdGVTdHIoKSArIFwiVm9ydGV4IFN0YXR1cyAtIGVycm9yOiBcIiArIG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzLm5leHQobWVzc2FnZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufVxuIl19