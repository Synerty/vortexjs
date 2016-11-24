import {Observable, Observer} from "rxjs";
import {Payload, IPayloadFilt} from "./Payload";
import {PayloadEndpoint} from "./PayloadEndpoint";
import {EventEmitter} from "@angular/core";
import {ComponentLifecycleEventEmitter} from "./ComponentLifecycleEventEmitter";
import {Vortex, SERVER_RESPONSE_TIMEOUT} from "./Vortex";
import {Tuple} from "./Tuple";
import "deep-equal";
import {plDeleteKey} from "./PayloadFilterKeys";
import {Ng2BalloonMsgService} from "@synerty/ng2-balloon-msg";
import {bind} from "./UtilMisc";

let equal = require('deep-equal');


// ------------------
// Some private structures

enum TupleLoaderEventEnum {
    Load,
    Save,
    Delete
}

interface IPromiseCallbacks {
    type: TupleLoaderEventEnum,
    resolve: any,
    reject: any
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
export class TupleLoader {

    private lastPayloadFilt: IPayloadFilt | null = null;
    private lastTuples: any[] | Tuple[] | null = null;

    private timer: number | null = null;

    private lastPromise: IPromiseCallbacks| null = null;

    event: EventEmitter<TupleLoaderEventEnum> = new EventEmitter<TupleLoaderEventEnum>();

    private endpoint: PayloadEndpoint | null = null;

    private _observable: Observable<Tuple[] | any[]>;
    private observer: Observer<Tuple[] | any[]>;


    constructor(private vortex: Vortex,
                private component: ComponentLifecycleEventEmitter,
                private filterUpdateCallable: IFilterUpdateCallable,
                private balloonMsg: Ng2BalloonMsgService | null = null) {

        // Regiseter for the angular docheck
        this.component.doCheckEvent.subscribe(() => this.filterChangeCheck());

        // Create the observable object
        this._observable = Observable.create(observer => this.observer = observer);

        // Call subscribe, otherwise the observer is never created, and we can never call
        // next() on it.
        this._observable.subscribe().unsubscribe();
    }

    /**
     * @property: The tuple observable to subscribe to.
     */
    get observable(): Observable<Tuple[] | any[]> {
        return this._observable;
    }

    filterChangeCheck(): void {
        // Create a copy
        let newFilter = Object.assign({}, this.filterUpdateCallable());

        if (newFilter == null) {
            if (this.endpoint != null) {
                this.endpoint.shutdown();
                this.endpoint = null;
            }

            this.lastTuples = null;
            this.lastPayloadFilt = null;
            return;
        }


        if (this.lastPayloadFilt != null &&
            equal(newFilter, this.lastPayloadFilt, {strict: true})) {
            return;
        }

        this.lastPayloadFilt = newFilter;
        this.endpoint = new PayloadEndpoint(this.component, this.lastPayloadFilt, true);
        this.endpoint.observable.subscribe(payload => this.processPayload(payload));

        this.vortex.send(new Payload(this.lastPayloadFilt));
    }

    /**
     * Load Loads the data from a server
     *
     * @returns: Promise<Payload>, which is called when the load succeeds or fails.
     *
     */
    load() {
        return this.saveOrLoad(TupleLoaderEventEnum.Load);
    }

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
    save(tuples: Tuple[] | any[] | null = null): Promise<Payload> {
        return this.saveOrLoad(TupleLoaderEventEnum.Save, tuples);
    }

    private saveOrLoad(type: TupleLoaderEventEnum,
                       tuples: any[] | Tuple[] | null = null): Promise<Payload> {

        // I'm not sure if the promise is set straight away, so at least null out
        // the last one.
        this.lastPromise = null;

        // Initialise the promise
        let promise = new Promise<Payload>((resolve, reject) =>
            this.lastPromise = {
                type: type,
                resolve: resolve,
                reject: reject
            }
        );

        // Check if there is already a load or save in progress
        if (this.setupTimer() !== true) {
            setTimeout(() => {
                this.lastPromise.reject("Another save or load is still in progress.");
                this.lastPromise = null;
            }, 0);
            return promise;
        }

        if (type === TupleLoaderEventEnum.Load) {
            // Force a filter update and reload
            this.lastPayloadFilt = null;
            this.filterChangeCheck();

            // If there was no filter update, fail
            if (this.lastPayloadFilt == null) {
                setTimeout(() => {
                    this.lastPromise.reject(
                        "There is no payload filter provided, load failed");
                    this.lastPromise = null;
                }, 0);
                return promise;
            }

        } else if (type === TupleLoaderEventEnum.Save
            || type === TupleLoaderEventEnum.Delete) {
            if (tuples != null)
                this.lastTuples = tuples;

            // Check if we have tuples to save.
            if (this.lastTuples == null) {
                setTimeout(() => {
                    this.lastPromise.reject(
                        "No tuples to save. " +
                        " Provide one to with the save(tuples) call or load some first " +
                        " with the filterUpdateCallable");
                    this.lastPromise = null;
                }, 0);
                return promise;
            }

            // Save the tuples
            this.vortex.send(new Payload(this.lastPayloadFilt, this.lastTuples));

        } else {
            throw new Error(`Type ${type} is not implemented.`);
        }

        // Return the promise
        return promise;
    }

    /**
     * Delete
     *
     * Sends the tuples to the server for it to delete them.
     *
     * @returns :Promise, which is called when the save succeeds or fails.
     *
     */
    del(tuples: any[] | Tuple[] | null = null): Promise<Payload> {
        // Set the delete key. The server will delete objects with this set.
        this.lastPayloadFilt[plDeleteKey] = true;

        let promise = this.saveOrLoad(TupleLoaderEventEnum.Delete, tuples);

        // Remove the delete key
        delete this.lastPayloadFilt[plDeleteKey];

        return promise;

    }

    private processPayload(payload: Payload) {

        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }

        // No result, means this was a load
        if (payload.result == null) {
            try {
                this.event.emit(TupleLoaderEventEnum.Load);
            } catch (e) {
                console.log("TupleLoader - Load event emit error");
                console.error(e);
            }

            // Result, means this was a save
        } else if (payload.result === true) {
            try {
                if (payload.filt.hasOwnProperty(plDeleteKey)) {
                    this.event.emit(TupleLoaderEventEnum.Delete);
                } else {
                    this.event.emit(TupleLoaderEventEnum.Save);
                }
            } catch (e) {
                console.log("TupleLoader - Save/Delete event emit error");
                console.error(e);
            }


            // Else, treat this as a failure
        } else {
            if (this.lastPromise) {
                this.lastPromise.reject(payload.result.toString());
                this.lastPromise = null;
            }

            this.balloonMsg && this.balloonMsg.showError(payload.result.toString());

            return;
        }

        if (this.lastPromise) {
            this.lastPromise.resolve(payload);
            this.lastPromise = null;
        }

        this.lastTuples = payload.tuples;
        this.observer.next(payload.tuples);
    }

    private resetTimer(): void {
        this.operationTimeout(false);
    }

    private setupTimer(): boolean {
        let self = this;
        if (self.timer != null) {
            this.balloonMsg && this.balloonMsg.showWarning(
                "We're already processing a request, Action failed");
            return false;
        }

        self.timer = setTimeout(SERVER_RESPONSE_TIMEOUT,
            bind(self, self.operationTimeout));
        return true;
    }

    private operationTimeout(showBaloon:boolean=true): void {
        this.timer = null;

        let msg:string = "The server failed to respond, operaton timed out";

        if (this.lastPromise) {
            msg = `${this.lastPromise.type} Failed, Response Timed out`;
            this.lastPromise.reject(msg);
            this.lastPromise = null;
        }

        showBaloon && this.balloonMsg && this.balloonMsg.showError(msg);
    }
}

