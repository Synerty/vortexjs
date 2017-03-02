import { Observable } from "rxjs";
import { Payload, IPayloadFilt } from "./Payload";
import { EventEmitter } from "@angular/core";
import { ComponentLifecycleEventEmitter } from "./ComponentLifecycleEventEmitter";
import { VortexClientABC } from "./VortexClientABC";
import { Tuple } from "./Tuple";
import { Ng2BalloonMsgService } from "@synerty/ng2-balloon-msg";
export declare enum TupleLoaderEventEnum {
    Load = 0,
    Save = 1,
    Delete = 2,
}
/**
 * Filter Update callable.
 *
 * This will be called to return a payload filter.
 * If the payload filter is null, TupleLoader will remove it's reference to old data
 * and wait.
 *
 * If the payload filter is not null and differs from the last payload filter, the
 * TupleLoader will send a request to the server..
 *
 */
export interface IFilterUpdateCallable {
    (): IPayloadFilt | null;
}
/**
 * TupleLoader for Angular2 + Synerty Vortex
 *
 * @param: vortex The vortex instance to send via.
 *
 * @param: component The component to register our events on.
 *
 * @param: filterUpdateCallable A IFilterUpdateCallable callable that returns null
 * or an IPayloadFilter
 *
 * @param: balloonMsg The Ng2BalloonMsgService
 *
 * Manual changes can be triggerd as follows.
 * * "load()"
 * * "save()"
 * * "del()"
 */
export declare class TupleLoader {
    private vortex;
    private component;
    private balloonMsg;
    private filterUpdateCallable;
    private lastPayloadFilt;
    private lastTuples;
    private timer;
    private lastPromise;
    event: EventEmitter<TupleLoaderEventEnum>;
    private endpoint;
    private _observable;
    private observer;
    constructor(vortex: VortexClientABC, component: ComponentLifecycleEventEmitter, filterUpdateCallable: IFilterUpdateCallable | IPayloadFilt, balloonMsg?: Ng2BalloonMsgService | null);
    /**
     * @property: The tuple observable to subscribe to.
     */
    readonly observable: Observable<Tuple[] | any[]>;
    filterChangeCheck(): void;
    /**
     * Load Loads the data from a server
     *
     * @returns: Promise<Payload>, which is called when the load succeeds or fails.
     *
     */
    load(): Promise<Payload>;
    /**
     * Save
     *
     * Collects the data from the form, into the tuple and sends it through the
     * vortex.
     *
     * @param: tuples The tuples to save, if tuples is null, the last loaded tuples will
     * be used.
     *
     * @returns: Promise, which is called when the save succeeds or fails.
     *
     */
    save(tuples?: Tuple[] | any[] | null): Promise<Payload>;
    private saveOrLoad(type, tuples?);
    /**
     * Delete
     *
     * Sends the tuples to the server for it to delete them.
     *
     * @returns :Promise, which is called when the save succeeds or fails.
     *
     */
    del(tuples?: any[] | Tuple[] | null): Promise<Payload>;
    private processPayload(payload);
    private resetTimer();
    private setupTimer();
    private operationTimeout(showBaloon?);
}
