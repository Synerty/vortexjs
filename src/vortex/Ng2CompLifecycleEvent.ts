import {EventEmitter, OnDestroy} from "@angular/core";

// Post to here if it works
// http://stackoverflow.com/questions/34743069/angular2-ngondestroy-emit-event

export class Ng2CompLifecycleEvent implements OnDestroy {
    onDestroyEvent: EventEmitter<string> = new EventEmitter<string>();

    ngOnDestroy() {
        this.onDestroyEvent.emit("component destroyed");
    }
}

// ------------------------------------------------------------------------------------
// Example usage below

export class MyComponent extends Ng2CompLifecycleEvent {
    constructor() {
        super();

    }
}

class CompLcObserver {
    constructor(private myComp: Ng2CompLifecycleEvent) {
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

