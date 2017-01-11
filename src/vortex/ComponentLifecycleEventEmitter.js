var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { EventEmitter } from "@angular/core";
// Post to here if it works
// http://stackoverflow.com/questions/34743069/angular2-ngondestroy-emit-event
var ComponentLifecycleEventEmitter = (function () {
    function ComponentLifecycleEventEmitter() {
        this.onDestroyEvent = new EventEmitter();
        this.doCheckEvent = new EventEmitter();
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
export { ComponentLifecycleEventEmitter };
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
export { MyComponent };
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
//# sourceMappingURL=/home/peek/project/vortexjs/src/src/vortex/ComponentLifecycleEventEmitter.js.map