import { EventEmitter, OnDestroy, OnInit, DoCheck } from "@angular/core";
export declare class ComponentLifecycleEventEmitter implements OnDestroy, DoCheck {
    onDestroyEvent: EventEmitter<string>;
    doCheckEvent: EventEmitter<string>;
    /** Angular2 On Destroy
     *
     * Cleanup just before Angular destroys the directive/component.
     * Unsubscribe observables and detach event handlers to avoid memory leaks, etc.
     *
     * Called just before Angular destroys the directive/component.
     */
    ngOnDestroy(): void;
    /**
     * Angular2 Do Check
     *
     * Detect and act upon changes that Angular can't or won't detect on its own.
     *
     * Called during every change detection
     * run, immediately after ngOnChanges and ngOnInit.
     */
    ngDoCheck(): void;
}
/**
 * Example component implementing the lifecycle observer
 */
export declare class MyComponent extends ComponentLifecycleEventEmitter implements OnInit {
    constructor();
    ngOnInit(): void;
}
