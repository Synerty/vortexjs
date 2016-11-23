import payloadIO from "./PayloadIO";
import Payload, {IPayloadFilt} from "./Payload";
import {assert} from "./UtilMisc";
import "./UtilArray";
import {Ng2CompLifecycleEvent} from "./Ng2CompLifecycleEvent";
import {Observer, Observable} from "rxjs"; // Ensure it's included and defined

export interface IPayloadEndpointCallback {
    (payload: Payload): string | null;
}

export default class PayloadEndpoint {
    private _observable: Observable<Payload>;
    private _observer: Observer<Payload>;

    private _filt: {key: string};
    private _lastPayloadDate: Date | null;
    private _processLatestOnly: boolean;

    constructor(component: Ng2CompLifecycleEvent,
                filter: IPayloadFilt,
                processLatestOnly: boolean = false) {
        let self = this;

        self._filt = filter;
        self._lastPayloadDate = null;
        self._processLatestOnly = processLatestOnly === true;

        assert(self._filt != null, "Payload filter is null");

        if (self._filt.key == null) {
            throw new Error("There is no 'key' in the payload filt"
                + ", There must be one for routing");
        }

        payloadIO.add(self);

        // Add auto tear downs for angular scopes
        let subscription = component.onDestroyEvent.subscribe(() => {
                this.shutdown();
                subscription.unsubscribe();
            }
        );

        this._observable = Observable.create(observer => this._observer = observer);

        // Call subscribe, otherwise the observer is never created, and we can never call
        // next() on it.
        this._observable.subscribe().unsubscribe();
    }

    get observable() {
        return this._observable;
    }

    /**
     * Process Payload
     * Check if the payload is meant for us then process it.
     *
     * @return null, or if the function is overloaded, you could return STOP_PROCESSING
     * from PayloadIO, which will tell it to stop processing further endpoints.
     */
    process = function (payload: Payload): null | string {
        if (!this.checkFilt(payload))
            return null;

        this._observer.next(payload);

        return null;
    };

    private checkFilt = function (payload): boolean {
        let self = this;
        for (let key in self._filt) {
            if (!self._filt.hasOwnProperty(key))
                continue;

            if (payload.filt[key] !== self._filt[key])
                return false;
        }

        if (self._processLatestOnly) {
            if (self._lastPayloadDate == null || self._lastPayloadDate < payload.date)
                self._lastPayloadDate = payload.date;
            else
                return false;
        }

        return true;
    };

    private shutdown = function () {
        let self = this;
        payloadIO.remove(self);
    };

}