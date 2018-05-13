import {Injectable} from "@angular/core";
import {Subject} from "rxjs/Subject";
import {VortexService} from "../VortexService";
import {Tuple} from "../Tuple";
import {TupleSelector} from "../TupleSelector";
import {IPayloadFilt, Payload} from "../Payload";
import {PayloadEndpoint} from "../PayloadEndpoint";
import {ComponentLifecycleEventEmitter} from "../ComponentLifecycleEventEmitter";
import {dictKeysFromObject, extend} from "../UtilMisc";
import {VortexStatusService} from "../VortexStatusService";
import {PayloadResponse} from "../PayloadResponse";
import * as moment from "moment";
import {PayloadEnvelope} from "../PayloadEnvelope";
import {TupleOfflineStorageService} from "../storage/TupleOfflineStorageService";

@Injectable()
export class TupleDataObservableNameService {
    constructor(public name: string, public additionalFilt = {}) {

    }

    equals(other: TupleDataObservableNameService): boolean {
        if (other == null)
            return false;
        if (this.name != other.name)
            return false;
        return JSON.stringify(this.additionalFilt) == JSON.stringify(other.additionalFilt);
    }

    toString(): string {
        return `${this.name}:${JSON.stringify(this.additionalFilt)}`;
    }
}


export class CachedSubscribedData {
    subject: Subject<Tuple[]> = new Subject<Tuple[]>();

    // The date the cache is scheduled to be torn down.
    // This will be X time after we notice that it has no subscribers
    private tearDownDate: number | null = null;
    private TEARDOWN_WAIT = 120 * 1000; // 2 minutes, in milliseconds

    tuples: Tuple[] = [];

    /** Last Server Payload Date
     * If the server has responded with a payload, this is the date in the payload
     * @type {Date | null}
     */
    lastServerPayloadDate: moment.Moment | null = null;

    cacheEnabled = true;
    storageEnabled = true;

    constructor(public tupleSelector: TupleSelector) {

    }

    markForTearDown(): void {
        if (this.tearDownDate == null)
            this.tearDownDate = Date.now() + this.TEARDOWN_WAIT;
    }

    resetTearDown(): void {
        this.tearDownDate = null;
    }

    isReadyForTearDown(): boolean {
        return this.tearDownDate != null && this.tearDownDate <= Date.now();
    }
}

@Injectable()
export class TupleDataOfflineObserverService extends ComponentLifecycleEventEmitter {

    private endpoint: PayloadEndpoint;
    private filt: IPayloadFilt;
    private cacheByTupleSelector: { [tupleSelector: string]: CachedSubscribedData } = {};

    constructor(private vortexService: VortexService,
                private vortexStatusService: VortexStatusService,
                private tupleDataObservableName: TupleDataObservableNameService,
                private tupleOfflineStorageService: TupleOfflineStorageService) {
        super();

        this.filt = extend({
            "name": tupleDataObservableName.name,
            "key": "tupleDataObservable"
        }, tupleDataObservableName.additionalFilt);

        this.endpoint = new PayloadEndpoint(this, this.filt);
        this.endpoint.observable
            .subscribe((payloadEnvelope: PayloadEnvelope) => {
                payloadEnvelope
                    .decodePayload()
                    .then((payload: Payload) => {
                        this.receivePayload(payload, payloadEnvelope.encodedPayload)
                    })
                    .catch(e => {
                        console.log(`TupleActionProcessorService:Error decoding payload ${e}`)
                    });
            });

        vortexStatusService.isOnline
            .takeUntil(this.onDestroyEvent)
            .filter(online => online === true)
            .subscribe(online => this.vortexOnlineChanged());

        // Cleanup dead subscribers every 30 seconds.
        let cleanupTimer = setInterval(() => this.cleanupDeadCaches(), 30000);
        this.onDestroyEvent.subscribe(() => clearInterval(cleanupTimer));

    }

    _nameService(): TupleDataObservableNameService {
        return this.tupleDataObservableName;
    }

    pollForTuples(tupleSelector: TupleSelector): Promise<Tuple[]> {

        // --- If the data exists in the cache, then return it
        let tsStr = tupleSelector.toOrderedJsonStr();

        if (this.cacheByTupleSelector.hasOwnProperty(tsStr)) {
            let cachedData = this.cacheByTupleSelector[tsStr];
            cachedData.resetTearDown();

            if (cachedData.cacheEnabled && cachedData.lastServerPayloadDate != null) {
                return Promise.resolve(cachedData.tuples);
            }
        }


        // --- Else, we want the data from the server
        // The PayloadEndpoint for this observable should also pickup and process
        // the response. So that will take care of the cache update and notify of
        // subscribers.

        let startFilt = extend({"subscribe": false}, this.filt, {
            "tupleSelector": tupleSelector
        });

        // Optionally typed, No need to worry about the fact that we convert this
        // and then TypeScript doesn't recognise that data type change
        let promise: any = new Payload(startFilt).makePayloadEnvelope();

        promise = promise.then((payloadEnvelope: PayloadEnvelope) => {
            return new PayloadResponse(this.vortexService, payloadEnvelope)
        });

        promise = promise.then((payloadEnvelope: PayloadEnvelope) => {
            return payloadEnvelope.decodePayload();
        });

        promise = promise.then((payload: Payload) => payload.tuples);

        return promise;
    }

    subscribeToTupleSelector(tupleSelector: TupleSelector,
                             enableCache: boolean = true,
                             enableStorage: boolean = true): Subject<Tuple[]> {

        let tsStr = tupleSelector.toOrderedJsonStr();

        if (this.cacheByTupleSelector.hasOwnProperty(tsStr)) {
            let cachedData = this.cacheByTupleSelector[tsStr];
            cachedData.resetTearDown();
            cachedData.cacheEnabled = cachedData.cacheEnabled && enableCache;
            cachedData.storageEnabled = cachedData.storageEnabled && enableStorage;

            if (cachedData.cacheEnabled && cachedData.lastServerPayloadDate != null) {
                // Emit after we return
                setTimeout(() => {
                    this.notifyObservers(cachedData, tupleSelector, cachedData.tuples);
                }, 0);
            } else {
                cachedData.tuples = [];
                this.tellServerWeWantData([tupleSelector], enableCache);
            }

            return cachedData.subject;
        }

        let newCachedData = new CachedSubscribedData(tupleSelector);
        newCachedData.cacheEnabled = enableCache;
        newCachedData.storageEnabled = enableStorage;
        this.cacheByTupleSelector[tsStr] = newCachedData;

        this.tellServerWeWantData([tupleSelector], enableCache);

        if (newCachedData.storageEnabled) {
            this.tupleOfflineStorageService
                .loadTuplesEncoded(tupleSelector)
                .then((vortexMsgOrNull: string | null) => {
                    // There is no data, return
                    if (vortexMsgOrNull == null)
                        return;

                    return Payload.fromEncodedPayload(vortexMsgOrNull)
                        .then((payload: Payload) => {

                            // If the server has responded before we loaded the data, then just
                            // ignore the cached data.
                            if (newCachedData.lastServerPayloadDate != null)
                                return;

                            // Update the tuples, and notify if them
                            newCachedData.tuples = payload.tuples;
                            this.notifyObservers(newCachedData, tupleSelector, payload.tuples);
                        });
                })
                .catch(err => {
                    this.vortexStatusService.logError(`loadTuples failed : ${err}`);
                    throw new Error(err);
                });
        }

        return newCachedData.subject;
    }

    /** Update Offline State
     *
     * This method updates the offline stored data, which will be used until the next
     * update from the server comes along.
     * @param tupleSelector: The tuple selector to update tuples for
     * @param tuples: The new data to store
     */
    updateOfflineState(tupleSelector: TupleSelector, tuples: Tuple[]): void {
        // AND store the data locally
        this.storeDataLocally(tupleSelector, tuples);

        let tsStr = tupleSelector.toOrderedJsonStr();

        if (this.cacheByTupleSelector.hasOwnProperty(tsStr)) {
            let cachedData = this.cacheByTupleSelector[tsStr];
            cachedData.tuples = tuples;
            this.notifyObservers(cachedData, tupleSelector, tuples);
        }
    }

    private cleanupDeadCaches(): void {
        for (let key of dictKeysFromObject(this.cacheByTupleSelector)) {
            let cachedData = this.cacheByTupleSelector[key];
            if (cachedData.subject.observers.length != 0) {
                cachedData.resetTearDown();
            } else {
                if (cachedData.isReadyForTearDown()) {
                    delete this.cacheByTupleSelector[key];
                    this.tellServerWeWantData(
                        [cachedData.tupleSelector],
                        cachedData.cacheEnabled,
                        true
                    );
                } else {
                    cachedData.markForTearDown();
                }
            }
        }
    }

    private vortexOnlineChanged(): void {
        this.cleanupDeadCaches();
        let tupleSelectors: TupleSelector[] = [];
        for (let key of dictKeysFromObject(this.cacheByTupleSelector)) {
            tupleSelectors.push(TupleSelector.fromJsonStr(key));
        }
        this.tellServerWeWantData(tupleSelectors);
    }

    private receivePayload(payload: Payload, encodedPayload: string): void {
        let tupleSelector = payload.filt["tupleSelector"];
        let tsStr = tupleSelector.toOrderedJsonStr();

        if (!this.cacheByTupleSelector.hasOwnProperty(tsStr))
            return;

        let cachedData = this.cacheByTupleSelector[tsStr];

        let lastDate = cachedData.lastServerPayloadDate;

        if (payload.date == null) {
            throw new Error("payload.date can not be null");
        }
        let thisDate = moment(payload.date);

        // If the data is old, then disregard it.
        if (lastDate != null && lastDate.isAfter(thisDate))
            return;

        cachedData.lastServerPayloadDate = thisDate;
        cachedData.tuples = payload.tuples;

        this.notifyObservers(cachedData, tupleSelector, payload.tuples, encodedPayload);
    }


    private tellServerWeWantData(tupleSelectors: TupleSelector[],
                                 enableCache: boolean = true,
                                 unsubscribe: boolean = false): void {
        if (!this.vortexStatusService.snapshot.isOnline)
            return;

        let startFilt = extend({"subscribe": true}, this.filt);

        let payloads: Payload[] = [];
        for (let tupleSelector of tupleSelectors) {
            let filt = extend({}, startFilt, {
                "tupleSelector": tupleSelector,
                "enableCache": enableCache,
                "unsubscribe": unsubscribe
            });

            payloads.push(new Payload(filt));
        }
        this.vortexService.sendPayload(payloads);
    }

    private notifyObservers(cachedData: CachedSubscribedData,
                            tupleSelector: TupleSelector,
                            tuples: Tuple[],
                            encodedPayload: string | null = null): void {
        // Notify Observers
        try {
            cachedData.subject.next(tuples);

        } catch (e) {
            // NOTE: Observables automatically remove observers when the raise exceptions.
            console.log(`ERROR: TupleDataObserverService.notifyObservers, observable has been removed
            ${e.toString()}
            ${tupleSelector.toOrderedJsonStr()}`);
        }

        // AND store the data locally
        if (cachedData.storageEnabled)
            this.storeDataLocally(tupleSelector, tuples, encodedPayload);
    }

    private storeDataLocally(tupleSelector: TupleSelector,
                             tuples: Tuple[],
                             encodedPayload: string | null = null): Promise<void> {

        let errFunc = (err: string) => {
            this.vortexStatusService.logError(`saveTuples failed : ${err}`);
            throw new Error(err);
        };

        if (encodedPayload == null) {
            return this.tupleOfflineStorageService.saveTuples(tupleSelector, tuples)
                .catch(errFunc);
        }

        this.tupleOfflineStorageService.saveTuplesEncoded(tupleSelector, encodedPayload)
            .catch(errFunc);
    }
}

