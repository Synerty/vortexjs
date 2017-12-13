"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
// Post to here if it works
// http://stackoverflow.com/questions/34743069/angular2-ngondestroy-emit-event
var ComponentLifecycleEventEmitter = (function () {
    function ComponentLifecycleEventEmitter() {
        this.onDestroyEvent = new core_1.EventEmitter();
        this.doCheckEvent = new core_1.EventEmitter();
    }
    /** Angular2 On Destroy
     *
     * Cleanup just before Angular destroys the directive/component.
     * Unsubscribe observables and detach event handlers to avoid memory leaks, etc.
     *
     * Called just before Angular destroys the directive/component.
     */
    ComponentLifecycleEventEmitter.prototype.ngOnDestroy = function () {
        this.onDestroyEvent.emit("OnDestroy");
        if (this.onDestroyEvent['observers'] != null) {
            for (var _i = 0, _a = this.onDestroyEvent['observers']; _i < _a.length; _i++) {
                var observer = _a[_i];
                observer["unsubscribe"]();
            }
        }
        if (this.doCheckEvent['observers'] != null) {
            for (var _b = 0, _c = this.doCheckEvent['observers']; _b < _c.length; _b++) {
                var observer = _c[_b];
                observer["unsubscribe"]();
            }
        }
    };
    /**
     * Angular2 Do Check
     *
     * Detect and act upon changes that Angular can't or won't detect on its own.
     *
     * Called during every change detection
     * run, immediately after ngOnChanges and ngOnInit.
     */
    ComponentLifecycleEventEmitter.prototype.ngDoCheck = function () {
        this.doCheckEvent.emit("DoCheck");
    };
    return ComponentLifecycleEventEmitter;
}());
exports.ComponentLifecycleEventEmitter = ComponentLifecycleEventEmitter;
// ------------------------------------------------------------------------------------
// Example usage below
/**
 * Example component implementing the lifecycle observer
 */
var MyComponent = (function (_super) {
    __extends(MyComponent, _super);
    function MyComponent() {
        return _super.call(this) || this;
    }
    MyComponent.prototype.ngOnInit = function () {
    };
    return MyComponent;
}(ComponentLifecycleEventEmitter));
exports.MyComponent = MyComponent;
/**
 * Example class using a lifecycle observer
 */
var CompLcObserver = (function () {
    function CompLcObserver(myComp) {
        var _this = this;
        this.myComp = myComp;
        var subscription = this.myComp.onDestroyEvent.subscribe(function () {
            _this.shutdown();
            subscription.unsubscribe();
        });
    }
    CompLcObserver.prototype.shutdown = function () {
        console.log("I shall die now!");
    };
    return CompLcObserver;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tcG9uZW50TGlmZWN5Y2xlRXZlbnRFbWl0dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQ29tcG9uZW50TGlmZWN5Y2xlRXZlbnRFbWl0dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXVFO0FBR3ZFLDJCQUEyQjtBQUMzQiw4RUFBOEU7QUFFOUU7SUFBQTtRQUVJLG1CQUFjLEdBQXlCLElBQUksbUJBQVksRUFBVSxDQUFDO1FBQ2xFLGlCQUFZLEdBQXlCLElBQUksbUJBQVksRUFBVSxDQUFDO0lBb0NwRSxDQUFDO0lBbENHOzs7Ozs7T0FNRztJQUNILG9EQUFXLEdBQVg7UUFDSSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUV0QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDM0MsR0FBRyxDQUFDLENBQWlCLFVBQWdDLEVBQWhDLEtBQUEsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsRUFBaEMsY0FBZ0MsRUFBaEMsSUFBZ0M7Z0JBQWhELElBQUksUUFBUSxTQUFBO2dCQUNiLFFBQVEsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDO2FBQzdCO1FBQ0wsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN6QyxHQUFHLENBQUMsQ0FBaUIsVUFBOEIsRUFBOUIsS0FBQSxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxFQUE5QixjQUE4QixFQUE5QixJQUE4QjtnQkFBOUMsSUFBSSxRQUFRLFNBQUE7Z0JBQ2IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUM7YUFDN0I7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxrREFBUyxHQUFUO1FBQ0ksSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUNMLHFDQUFDO0FBQUQsQ0FBQyxBQXZDRCxJQXVDQztBQXZDWSx3RUFBOEI7QUF5QzNDLHVGQUF1RjtBQUN2RixzQkFBc0I7QUFFdEI7O0dBRUc7QUFDSDtJQUFpQywrQkFBOEI7SUFDM0Q7ZUFDSSxpQkFBTztJQUVYLENBQUM7SUFFRCw4QkFBUSxHQUFSO0lBQ0EsQ0FBQztJQUNMLGtCQUFDO0FBQUQsQ0FBQyxBQVJELENBQWlDLDhCQUE4QixHQVE5RDtBQVJZLGtDQUFXO0FBVXhCOztHQUVHO0FBQ0g7SUFDSSx3QkFBb0IsTUFBc0M7UUFBMUQsaUJBTUM7UUFObUIsV0FBTSxHQUFOLE1BQU0sQ0FBZ0M7UUFDdEQsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDO1lBQ2hELEtBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNoQixZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDL0IsQ0FBQyxDQUNKLENBQUM7SUFDTixDQUFDO0lBRU8saUNBQVEsR0FBaEI7UUFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUNMLHFCQUFDO0FBQUQsQ0FBQyxBQVpELElBWUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0V2ZW50RW1pdHRlciwgT25EZXN0cm95LCBPbkluaXQsIERvQ2hlY2t9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQge09ic2VydmVyfSBmcm9tIFwicnhqc1wiO1xuXG4vLyBQb3N0IHRvIGhlcmUgaWYgaXQgd29ya3Ncbi8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzQ3NDMwNjkvYW5ndWxhcjItbmdvbmRlc3Ryb3ktZW1pdC1ldmVudFxuXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50TGlmZWN5Y2xlRXZlbnRFbWl0dGVyIGltcGxlbWVudHNcbiAgICBPbkRlc3Ryb3ksIERvQ2hlY2sge1xuICAgIG9uRGVzdHJveUV2ZW50OiBFdmVudEVtaXR0ZXI8c3RyaW5nPiA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuICAgIGRvQ2hlY2tFdmVudDogRXZlbnRFbWl0dGVyPHN0cmluZz4gPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcblxuICAgIC8qKiBBbmd1bGFyMiBPbiBEZXN0cm95XG4gICAgICpcbiAgICAgKiBDbGVhbnVwIGp1c3QgYmVmb3JlIEFuZ3VsYXIgZGVzdHJveXMgdGhlIGRpcmVjdGl2ZS9jb21wb25lbnQuXG4gICAgICogVW5zdWJzY3JpYmUgb2JzZXJ2YWJsZXMgYW5kIGRldGFjaCBldmVudCBoYW5kbGVycyB0byBhdm9pZCBtZW1vcnkgbGVha3MsIGV0Yy5cbiAgICAgKlxuICAgICAqIENhbGxlZCBqdXN0IGJlZm9yZSBBbmd1bGFyIGRlc3Ryb3lzIHRoZSBkaXJlY3RpdmUvY29tcG9uZW50LlxuICAgICAqL1xuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLm9uRGVzdHJveUV2ZW50LmVtaXQoXCJPbkRlc3Ryb3lcIik7XG5cbiAgICAgICAgaWYgKHRoaXMub25EZXN0cm95RXZlbnRbJ29ic2VydmVycyddICE9IG51bGwpIHtcbiAgICAgICAgICAgIGZvciAobGV0IG9ic2VydmVyIG9mIHRoaXMub25EZXN0cm95RXZlbnRbJ29ic2VydmVycyddKSB7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXJbXCJ1bnN1YnNjcmliZVwiXSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZG9DaGVja0V2ZW50WydvYnNlcnZlcnMnXSAhPSBudWxsKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBvYnNlcnZlciBvZiB0aGlzLmRvQ2hlY2tFdmVudFsnb2JzZXJ2ZXJzJ10pIHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlcltcInVuc3Vic2NyaWJlXCJdKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBbmd1bGFyMiBEbyBDaGVja1xuICAgICAqXG4gICAgICogRGV0ZWN0IGFuZCBhY3QgdXBvbiBjaGFuZ2VzIHRoYXQgQW5ndWxhciBjYW4ndCBvciB3b24ndCBkZXRlY3Qgb24gaXRzIG93bi5cbiAgICAgKlxuICAgICAqIENhbGxlZCBkdXJpbmcgZXZlcnkgY2hhbmdlIGRldGVjdGlvblxuICAgICAqIHJ1biwgaW1tZWRpYXRlbHkgYWZ0ZXIgbmdPbkNoYW5nZXMgYW5kIG5nT25Jbml0LlxuICAgICAqL1xuICAgIG5nRG9DaGVjaygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kb0NoZWNrRXZlbnQuZW1pdChcIkRvQ2hlY2tcIik7XG4gICAgfVxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4YW1wbGUgdXNhZ2UgYmVsb3dcblxuLyoqXG4gKiBFeGFtcGxlIGNvbXBvbmVudCBpbXBsZW1lbnRpbmcgdGhlIGxpZmVjeWNsZSBvYnNlcnZlclxuICovXG5leHBvcnQgY2xhc3MgTXlDb21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnRMaWZlY3ljbGVFdmVudEVtaXR0ZXIgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgfVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgfVxufVxuXG4vKipcbiAqIEV4YW1wbGUgY2xhc3MgdXNpbmcgYSBsaWZlY3ljbGUgb2JzZXJ2ZXJcbiAqL1xuY2xhc3MgQ29tcExjT2JzZXJ2ZXIge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgbXlDb21wOiBDb21wb25lbnRMaWZlY3ljbGVFdmVudEVtaXR0ZXIpIHtcbiAgICAgICAgbGV0IHN1YnNjcmlwdGlvbiA9IHRoaXMubXlDb21wLm9uRGVzdHJveUV2ZW50LnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zaHV0ZG93bigpO1xuICAgICAgICAgICAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2h1dGRvd24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiSSBzaGFsbCBkaWUgbm93IVwiKTtcbiAgICB9XG59XG5cbiJdfQ==