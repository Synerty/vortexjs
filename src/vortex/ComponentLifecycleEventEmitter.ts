import {EventEmitter, OnDestroy, OnInit, DoCheck} from "@angular/core";
import {Observer} from "rxjs/Observer";

// Post to here if it works
// http://stackoverflow.com/questions/34743069/angular2-ngondestroy-emit-event

export class ComponentLifecycleEventEmitter implements
    OnDestroy, DoCheck {
    onDestroyEvent: EventEmitter<string> = new EventEmitter<string>();
    doCheckEvent: EventEmitter<string> = new EventEmitter<string>();

    /** Angular2 On Destroy
     *
     * Cleanup just before Angular destroys the directive/component.
     * Unsubscribe observables and detach event handlers to avoid memory leaks, etc.
     *
     * Called just before Angular destroys the directive/component.
     */
    ngOnDestroy() {
        this.onDestroyEvent.emit("OnDestroy");

        if (this.onDestroyEvent['observers'] != null) {
            for (let observer of this.onDestroyEvent['observers']) {
                observer["unsubscribe"]();
            }
        }

        if (this.doCheckEvent['observers'] != null) {
            for (let observer of this.doCheckEvent['observers']) {
                observer["unsubscribe"]();
            }
        }
    }

    /**
     * Angular2 Do Check
     *
     * Detect and act upon changes that Angular can't or won't detect on its own.
     *
     * Called during every change detection
     * run, immediately after ngOnChanges and ngOnInit.
     */
    ngDoCheck(): void {
        this.doCheckEvent.emit("DoCheck");
    }
}

// ------------------------------------------------------------------------------------
// Example usage below

/**
 * Example component implementing the lifecycle observer
 */
export class MyComponent extends ComponentLifecycleEventEmitter implements OnInit {
    constructor() {
        super();

    }

    ngOnInit(): void {
    }
}

/**
 * Example class using a lifecycle observer
 */
class CompLcObserver {
    constructor(private myComp: ComponentLifecycleEventEmitter) {
        let subscription = this.myComp.onDestroyEvent.subscribe(() => {
                this.shutdown();
                subscription.unsubscribe();
            }
        );
    }

    private shutdown() {
        console.log("I shall die now!");
    }
}

