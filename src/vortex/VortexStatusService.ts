import {Injectable, NgZone} from "@angular/core";
import {Subject} from "rxjs/Subject";
import {dateStr} from "./UtilMisc";


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

        console.debug(dateStr() + "Vortex Status - online: " + online);

        this.zone.run(() => {
            this.isOnline.next(online);
        });
        this.wasOnline = online;
    }

    logInfo(message: string) {
        console.debug(dateStr() + "Vortex Status - info: " + message);
        this.zone.run(() => {
            this.info.next(message);
        });
    }

    logError(message: string) {
        console.debug(dateStr() + "Vortex Status - error: " + message);
        this.zone.run(() => {
            this.errors.next(message);
        });
    }

}
