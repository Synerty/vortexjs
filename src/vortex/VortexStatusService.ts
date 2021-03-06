import { Inject, Injectable, NgZone } from "@angular/core"
import { Subject } from "rxjs"
import { bind, dateStr } from "./UtilMisc"

// Node compatibility
const logDebug = console.debug ? bind(console, console.debug) : bind(console, console.log)
const logInfo = bind(console, console.log)
const logError = console.error ? bind(console, console.error) : bind(console, console.log)
const logWarning = console.warn ? bind(console, console.warn) : bind(console, console.log)

export interface VortexStatusServiceSnapshot {
    isOnline: boolean;
    queuedActionCount: number;
}

@Injectable()
export class VortexStatusService {
    
    isOnline: Subject<boolean> = new Subject<boolean>()
    info: Subject<string> = new Subject<string>()
    warning: Subject<string> = new Subject<string>()
    errors: Subject<string> = new Subject<string>()
    
    private wasOnline: boolean = false
    
    constructor(@Inject(NgZone) private zone: NgZone) {}
    
    get snapshot(): VortexStatusServiceSnapshot {
        return {
            isOnline: this.wasOnline,
            queuedActionCount: this.lastQueuedTupleActions
        }
    }
    
    setOnline(online: boolean) {
        if (online === this.wasOnline)
            return
        
        logDebug(dateStr() + "Vortex Status - online: " + online)
        
        this.wasOnline = online
        this.zone.run(() => {
            this.isOnline.next(online)
        })
    }
    
    queuedActionCount: Subject<number> = new Subject<number>()
    lastQueuedTupleActions: number = 0
    
    incrementQueuedActionCount() {
        this.setQueuedActionCount(this.lastQueuedTupleActions + 1)
    }
    
    decrementQueuedActionCount() {
        this.setQueuedActionCount(this.lastQueuedTupleActions - 1)
    }
    
    setQueuedActionCount(count: number) {
        if (count === this.lastQueuedTupleActions)
            return
        
        this.lastQueuedTupleActions = count
        this.zone.run(() => {
            this.queuedActionCount.next(count)
        })
    }

    logInfo(message: string) {
        logInfo(dateStr() + "Vortex Status - info: " + message)
        this.zone.run(() => {
            this.info.next(message)
        })
    }

    logWarning(message: string) {
        logWarning(dateStr() + "Vortex Status - warning: " + message)
        this.zone.run(() => {
            this.warning.next(message)
        })
    }
    
    logError(message: string) {
        logError(dateStr() + "Vortex Status - error: " + message)
        this.zone.run(() => {
            this.errors.next(message)
        })
    }
    
}
