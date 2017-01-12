import {Injectable, NgZone} from "@angular/core";
import {Subject} from "rxjs/Subject";
import {dateStr, bind} from "./UtilMisc";

// Node compatibility
let logDebug = console.debug ? bind(console, console.debug) : bind(console, console.log);
let logInfo = bind(console, console.log);
let logError = console.error ? bind(console, console.error) : bind(console, console.log);

@Injectable()
export class VortexStatusService {

    isOnline: Subject<boolean> = new Subject<boolean>();
    info: Subject<string> = new Subject<string>();
    errors: Subject<string> = new Subject<string>();

    private wasOnline: boolean = false;

    constructor(private zone: NgZone) {

    }

    setOnline(online: boolean) {
        if (online === this.wasOnline)
            return;

        logDebug(dateStr() + "Vortex Status - online: " + online);

        this.zone.run(() => {
            this.isOnline.next(online);
        });
        this.wasOnline = online;
    }

    logInfo(message: string) {
        logInfo(dateStr() + "Vortex Status - info: " + message);
        this.zone.run(() => {
            this.info.next(message);
        });
    }

    logError(message: string) {
        logError(dateStr() + "Vortex Status - error: " + message);
        this.zone.run(() => {
            this.errors.next(message);
        });
    }

}
