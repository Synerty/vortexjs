import { NgZone } from "@angular/core";
import { Subject } from "rxjs/Subject";
export interface VortexStatusServiceSnapshot {
    isOnline: boolean;
    queuedActionCount: number;
}
export declare class VortexStatusService {
    private zone;
    isOnline: Subject<boolean>;
    info: Subject<string>;
    errors: Subject<string>;
    private wasOnline;
    constructor(zone: NgZone);
    readonly snapshot: VortexStatusServiceSnapshot;
    setOnline(online: boolean): void;
    queuedActionCount: Subject<number>;
    lastQueuedTupleActions: number;
    incrementQueuedActionCount(): void;
    decrementQueuedActionCount(): void;
    setQueuedActionCount(count: number): void;
    logInfo(message: string): void;
    logError(message: string): void;
}