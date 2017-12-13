"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ComponentLifecycleEventEmitter_1 = require("./ComponentLifecycleEventEmitter");
var Ang2TupleLoaderTest = (function (_super) {
    __extends(Ang2TupleLoaderTest, _super);
    function Ang2TupleLoaderTest(vortexService) {
        var _this = _super.call(this) || this;
        _this.vortexService = vortexService;
        _this.tuples = [];
        _this.id = null;
        _this.loader = vortexService.createTupleLoader(_this, function () {
            return {
                key: "plugin_noop.tuple_loader.items",
                id: _this.id
            };
        });
        _this.loader.observable.subscribe(function (tuples) { return _this.tuples = tuples; });
        return _this;
    }
    return Ang2TupleLoaderTest;
}(ComponentLifecycleEventEmitter_1.ComponentLifecycleEventEmitter));
exports.Ang2TupleLoaderTest = Ang2TupleLoaderTest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHVwbGVMb2FkZXJUZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiVHVwbGVMb2FkZXJUZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsbUZBQWdGO0FBSWhGO0lBQXlDLHVDQUE4QjtJQU9uRSw2QkFBb0IsYUFBNEI7UUFBaEQsWUFDSSxpQkFBTyxTQVlWO1FBYm1CLG1CQUFhLEdBQWIsYUFBYSxDQUFlO1FBTGhELFlBQU0sR0FBVSxFQUFFLENBQUM7UUFDbkIsUUFBRSxHQUFnQixJQUFJLENBQUM7UUFPbkIsS0FBSSxDQUFDLE1BQU0sR0FBRyxhQUFhLENBQUMsaUJBQWlCLENBQUMsS0FBSSxFQUM5QztZQUNJLE1BQU0sQ0FBQztnQkFDSCxHQUFHLEVBQUUsZ0NBQWdDO2dCQUNyQyxFQUFFLEVBQUUsS0FBSSxDQUFDLEVBQUU7YUFDZCxDQUFBO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFUCxLQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBQSxNQUFNLElBQUksT0FBQSxLQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sRUFBcEIsQ0FBb0IsQ0FBQyxDQUFDOztJQUVyRSxDQUFDO0lBQ0wsMEJBQUM7QUFBRCxDQUFDLEFBckJELENBQXlDLCtEQUE4QixHQXFCdEU7QUFyQlksa0RBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtUdXBsZUxvYWRlcn0gZnJvbSBcIi4vVHVwbGVMb2FkZXJcIjtcbmltcG9ydCB7Q29tcG9uZW50TGlmZWN5Y2xlRXZlbnRFbWl0dGVyfSBmcm9tIFwiLi9Db21wb25lbnRMaWZlY3ljbGVFdmVudEVtaXR0ZXJcIjtcbmltcG9ydCB7Vm9ydGV4U2VydmljZX0gZnJvbSBcIi4vVm9ydGV4U2VydmljZVwiO1xuXG5cbmV4cG9ydCBjbGFzcyBBbmcyVHVwbGVMb2FkZXJUZXN0IGV4dGVuZHMgQ29tcG9uZW50TGlmZWN5Y2xlRXZlbnRFbWl0dGVyIHtcblxuICAgIHR1cGxlczogYW55W10gPSBbXTtcbiAgICBpZDogbnVtYmVyfG51bGwgPSBudWxsO1xuXG4gICAgcHJpdmF0ZSBsb2FkZXI6IFR1cGxlTG9hZGVyO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSB2b3J0ZXhTZXJ2aWNlOiBWb3J0ZXhTZXJ2aWNlKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5sb2FkZXIgPSB2b3J0ZXhTZXJ2aWNlLmNyZWF0ZVR1cGxlTG9hZGVyKHRoaXMsXG4gICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiBcInBsdWdpbl9ub29wLnR1cGxlX2xvYWRlci5pdGVtc1wiLFxuICAgICAgICAgICAgICAgICAgICBpZDogdGhpcy5pZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMubG9hZGVyLm9ic2VydmFibGUuc3Vic2NyaWJlKHR1cGxlcyA9PiB0aGlzLnR1cGxlcyA9IHR1cGxlcyk7XG5cbiAgICB9XG59Il19