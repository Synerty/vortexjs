import { AfterViewInit, DoCheck, EventEmitter, OnDestroy, OnInit } from "@angular/core"

export class NgLifeCycleEvents implements OnInit, AfterViewInit, OnDestroy, DoCheck {
    onInitEvent: EventEmitter<string> = new EventEmitter<string>()
    afterViewInitEvent: EventEmitter<string> = new EventEmitter<string>()
    onDestroyEvent: EventEmitter<string> = new EventEmitter<string>()
    doCheckEvent: EventEmitter<string> = new EventEmitter<string>()
    
    ngOnInit() {
        this.onInitEvent.emit("OnInit")
    }
    
    ngAfterViewInit() {
        this.afterViewInitEvent.emit("AfterViewInit")
    }
    
    ngDoCheck(): void {
        this.doCheckEvent.emit("DoCheck")
    }
    
    ngOnDestroy() {
        this.onDestroyEvent.emit("OnDestroy")
        
        if (this.onDestroyEvent["observers"] != null) {
            for (let observer of this.onDestroyEvent["observers"]) {
                observer["unsubscribe"]()
            }
        }
        
        if (this.doCheckEvent["observers"] != null) {
            for (let observer of this.doCheckEvent["observers"]) {
                observer["unsubscribe"]()
            }
        }
        
        if (this.onInitEvent["observers"] != null) {
            for (let observer of this.onInitEvent["observers"]) {
                observer["unsubscribe"]()
            }
        }
        
        if (this.afterViewInitEvent["observers"] != null) {
            for (let observer of this.afterViewInitEvent["observers"]) {
                observer["unsubscribe"]()
            }
        }
    }
}
