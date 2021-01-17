import { Inject, Injectable } from "@angular/core"
import { Observable, Subject } from "rxjs"
import { filter, takeUntil } from "rxjs/operators"
import { VortexService } from "../VortexService"
import { Tuple } from "../exports"
import { TupleSelector } from "../TupleSelector"
import { IPayloadFilt, Payload } from "../Payload"
import { PayloadEndpoint } from "../PayloadEndpoint"
import { NgLifeCycleEvents } from "../../util/NgLifeCycleEvents"
import { dictKeysFromObject, extend } from "../UtilMisc"
import { VortexStatusService } from "../VortexStatusService"
import { PayloadResponse } from "../PayloadResponse"
import * as moment from "moment"
import { PayloadEnvelope } from "../PayloadEnvelope"
import { TupleOfflineStorageService } from "../storage/TupleOfflineStorageService"

export class TupleDataObservableNameService {
    constructor(
        public name: string,
        public additionalFilt: any = {}
    ) {
    }
    
    equals(other: TupleDataObservableNameService): boolean {
        if (other == null)
            return false
        if (this.name != other.name)
            return false
        return JSON.stringify(this.additionalFilt) == JSON.stringify(other.additionalFilt)
    }
    
    toString(): string {
        return `${this.name}:${JSON.stringify(this.additionalFilt)}`
    }
}

export class CachedSubscribedData {
    subject: Subject<Tuple[]> = new Subject<Tuple[]>()
    
    /** Last Server Payload Date
     * If the server has responded with a payload, this is the date in the payload
     * @type {Date | null}
     */
    lastServerPayloadDate: moment.Moment | null = null
    lastServerAskDate: moment.Moment | null = null
    
    cacheEnabled = true
    storageEnabled = true
    askServerEnabled = true
    
    constructor(public tupleSelector: TupleSelector) {
        this.touch()
    }
    
    // The date the cache is scheduled to be torn down.
    // This will be X time after we notice that it has no subscribers
    private tearDownDate: number | null = null
    private TEARDOWN_WAIT = 30 * 1000 // 30 seconds, in milliseconds
    
    markForTearDown(): void {
        if (this.tearDownDate == null)
            this.tearDownDate = Date.now()
    }
    
    resetTearDown(): void {
        this.tearDownDate = null
        this.touch()
    }
    
    isReadyForTearDown(): boolean {
        return this.tearDownDate != null
            && (this.tearDownDate + this.TEARDOWN_WAIT) <= Date.now()
    }
    
    private _tuples: Tuple[] | null = null
    
    get tuples(): Tuple[] | null {
        return this._tuples
    }
    
    set tuples(tuples: Tuple[]) {
        this.touch()
        this._tuples = tuples
    }
    
    /** Last Touched
     *
     * The last date that this cache was touched (subscribed or updated)
     * @type {Date | null}
     */
    private FLUSH_WAIT = 120 * 1000 // 2 minutes, in milliseconds
    private _lastTouched: number | null = null
    
    touch(): void {
        this._lastTouched = Date.now()
    }
    
    isReadyForFlush(): boolean {
        return this._lastTouched != null
            && (this._lastTouched + this.FLUSH_WAIT) <= Date.now()
    }
    
    flush(): void {
        this.lastServerAskDate = null
        this.lastServerPayloadDate = null
        this._tuples = null
    }
}

@Injectable()
export class TupleDataOfflineObserverService extends NgLifeCycleEvents {
    private endpoint: PayloadEndpoint
    private filt: IPayloadFilt
    private cacheByTupleSelector: { [tupleSelector: string]: CachedSubscribedData } = {}
    
    constructor(
        @Inject(VortexService) private vortexService,
        @Inject(VortexStatusService) private vortexStatusService,
        @Inject(TupleDataObservableNameService) private tupleDataObservableName,
        @Inject(TupleOfflineStorageService) private tupleOfflineStorageService,
    ) {
        super()
        
        this.filt = extend({
            "name": tupleDataObservableName.name,
            "key": "tupleDataObservable"
        }, tupleDataObservableName.additionalFilt)
        
        this.endpoint = new PayloadEndpoint(this, this.filt)
        this.endpoint.observable
            .subscribe((payloadEnvelope: PayloadEnvelope) => {
                payloadEnvelope
                    .decodePayload()
                    .then((payload: Payload) => {
                        this.receivePayload(payload, payloadEnvelope.encodedPayload)
                    })
                    .catch(e => {
                        console.log(`TupleActionProcessorService:Error decoding payload ${e}`)
                    })
            })
        
        vortexStatusService.isOnline
            .pipe(
                takeUntil(this.onDestroyEvent),
                filter(online => online === true))
            .subscribe(online => this.vortexOnlineChanged())
        
        // Cleanup dead subscribers every 30 seconds.
        let cleanupTimer = setInterval(() => this.cleanupDeadCaches(), 2000)
        this.onDestroyEvent.subscribe(() => clearInterval(cleanupTimer))
        
    }
    
    _nameService(): TupleDataObservableNameService {
        return this.tupleDataObservableName
    }
    
    pollForTuples(
        tupleSelector: TupleSelector,
        useCache: boolean = true
    ): Promise<Tuple[]> {
        
        // --- If the data exists in the cache, then return it
        let tsStr = tupleSelector.toOrderedJsonStr()
        
        if (useCache && this.cacheByTupleSelector.hasOwnProperty(tsStr)) {
            let cachedData = this.cacheByTupleSelector[tsStr]
            cachedData.resetTearDown()
            
            if (cachedData.cacheEnabled && cachedData.lastServerPayloadDate != null) {
                return Promise.resolve(cachedData.tuples)
            }
        }
        
        // --- Else, we want the data from the server
        // The PayloadEndpoint for this observable should also pickup and process
        // the response. So that will take care of the cache update and notify of
        // subscribers.
        
        let startFilt = extend({"subscribe": false, useCache: useCache}, this.filt, {
            "tupleSelector": tupleSelector
        })
        
        // Optionally typed, No need to worry about the fact that we convert this
        // and then TypeScript doesn't recognise that data type change
        let promise: any = new Payload(startFilt).makePayloadEnvelope()
        
        promise = promise.then((payloadEnvelope: PayloadEnvelope) => {
            return new PayloadResponse(this.vortexService, payloadEnvelope)
        })
        
        promise = promise.then((payloadEnvelope: PayloadEnvelope) => {
            return payloadEnvelope.decodePayload()
        })
        
        promise = promise.then((payload: Payload) => payload.tuples)
        
        return promise
    }
    
    /** Flush Cache
     *
     * The Data Offine Observer can be used to offline cache data by observing a large
     * amounts of data, more data then the user would normally look at.
     *
     * If it's being used like this then the cache should be flushed during the process
     * to ensure it's not all being kept in memory.
     *
     * @param {TupleSelector} tupleSelector The tuple selector to flush the cache for
     */
    flushCache(tupleSelector: TupleSelector): void {
        
        let tsStr = tupleSelector.toOrderedJsonStr()
        if (this.cacheByTupleSelector.hasOwnProperty(tsStr)) {
            let cachedData = this.cacheByTupleSelector[tsStr]
            cachedData.flush()
        }
        this.cleanupDeadCaches()
        
    }
    
    /** Promise from to Tuple Selector
     *
     * See the subscribeToTupleSelector method for more details.
     * The promise will fire on the first emit of data.
     *
     * Do not use this when there will be no data present,
     * or it may cause a memory leak.
     *
     * @param {TupleSelector} tupleSelector
     * @param {boolean} disableCache
     * @param {boolean} disableStorage
     * @param {boolean} disableAskServer, Use this to store and observe data completely
     *      within the angular app.
     * @returns {Subject<Tuple[]>}
     */
    promiseFromTupleSelector(
        tupleSelector: TupleSelector,
        disableCache: boolean = false,
        disableStorage: boolean = false,
        disableAskServer: boolean = false
    ): Promise<Tuple[]> {
        let observable = this.subscribeToTupleSelector(
            tupleSelector, disableCache, disableStorage, disableAskServer
        )
        
        return new Promise<Tuple[]>((
            resolve,
            reject
        ) => {
            let subscription = observable
                .subscribe((x) => {
                    subscription.unsubscribe()
                    resolve(x)
                }, (err) => {
                    subscription.unsubscribe()
                    reject(err)
                }, () => {
                    subscription.unsubscribe()
                    resolve([])
                })
        })
        
    }
    
    /** Subscribe to Tuple Selector
     *
     * Get an observable that will be fired when any new data updates are available
     * Data is loaded from the local db cache, while it waits for the server to respond.
     * * either from the server, or if they are locally updated with updateOfflineState()
     *
     * @param {TupleSelector} tupleSelector
     * @param {boolean} disableCache
     * @param {boolean} disableStorage
     * @param {boolean} disableAskServer, Use this to store and observe data completely
     *      within the angular app.
     * @returns {Subject<Tuple[]>}
     */
    subscribeToTupleSelector(
        tupleSelector: TupleSelector,
        disableCache: boolean = false,
        disableStorage: boolean = false,
        disableAskServer: boolean = false
    ): Observable<Tuple[]> {
        
        let tsStr = tupleSelector.toOrderedJsonStr()
        let cachedData: CachedSubscribedData | null = null
        
        // If the cache exists, use it
        if (this.cacheByTupleSelector.hasOwnProperty(tsStr)) {
            cachedData = this.cacheByTupleSelector[tsStr]
            cachedData.cacheEnabled = cachedData.cacheEnabled && !disableCache
            cachedData.storageEnabled = cachedData.storageEnabled && !disableStorage
            cachedData.askServerEnabled = cachedData.askServerEnabled && !disableAskServer
            
            // If the cache is enabled, and we have tuple data, then notify
            if (cachedData.cacheEnabled && cachedData.tuples != null) {
                // Emit after we return, to ensure the subscribe happens first
                setTimeout(() => {
                    this.notifyObservers(cachedData, tupleSelector, cachedData.tuples)
                }, 0)
                
                return cachedData.subject
            }
            
            // ELSE, Create the cache
        }
        else {
            
            cachedData = new CachedSubscribedData(tupleSelector)
            cachedData.cacheEnabled = !disableCache
            cachedData.storageEnabled = !disableStorage
            cachedData.askServerEnabled = !disableAskServer
            
            this.cacheByTupleSelector[tsStr] = cachedData
        }
        
        // If asking the server is enabled and we have not asked the server, then ask
        if (cachedData.askServerEnabled && cachedData.lastServerAskDate == null) {
            this.tellServerWeWantData([tupleSelector], disableCache)
        }
        
        // If the tuples are null (because it's new or been flushed),
        // Then ask the local DB again for it.
        if (cachedData.storageEnabled && cachedData.tuples == null) {
            this.tupleOfflineStorageService
                .loadTuplesEncoded(tupleSelector)
                .then((vortexMsgOrNull: string | null) => {
                    // There is no data, return
                    if (vortexMsgOrNull == null)
                        return
                    
                    return Payload.fromEncodedPayload(vortexMsgOrNull)
                        .then((payload: Payload) => {
                            
                            // If the server has responded before we loaded the data, then just
                            // ignore the cached data.
                            if (cachedData.lastServerPayloadDate != null)
                                return
                            
                            // Update the tuples, and notify if them
                            cachedData.tuples = payload.tuples
                            this.notifyObservers(cachedData, tupleSelector, payload.tuples)
                        })
                })
                .catch(err => {
                    this.vortexStatusService.logError(`loadTuples failed : ${err}`)
                    throw new Error(err)
                })
        }
        
        cachedData.resetTearDown()
        return cachedData.subject
    }
    
    /** Update Offline State
     *
     * This method updates the offline stored data, which will be used until the next
     * update from the server comes along.
     * @param tupleSelector: The tuple selector to update tuples for
     * @param tuples: The new data to store
     */
    updateOfflineState(
        tupleSelector: TupleSelector,
        tuples: Tuple[]
    ): Promise<void> {
        let tsStr = tupleSelector.toOrderedJsonStr()
        
        if (!this.cacheByTupleSelector.hasOwnProperty(tsStr))
            return
        let cachedData = this.cacheByTupleSelector[tsStr]
        
        // Make note of the last server update date
        let lastServerDate = cachedData.lastServerPayloadDate
        
        // AND store the data locally
        return this.storeDataLocally(tupleSelector, tuples)
            .then(() => {
                
                // If the server has updated the data since the last update,
                // then don't notify.
                if (lastServerDate != cachedData.lastServerPayloadDate)
                    return
                
                cachedData.tuples = tuples
                this.notifyObservers(cachedData, tupleSelector, tuples)
            })
    }
    
    private cleanupDeadCaches(): void {
        for (let key of dictKeysFromObject(this.cacheByTupleSelector)) {
            let cachedData = this.cacheByTupleSelector[key]
            
            // If no activity has occured on the cache, then flush it
            if (cachedData.isReadyForFlush()) {
                console.log(`Flushing cache due to expiry ${key}`)
                cachedData.flush()
            }
            
            // Tear down happens 30s after the last subscriber unsubscribes
            // If there are subscribers, then reset the teardown clock
            if (cachedData.subject.observers.length != 0) {
                cachedData.resetTearDown()
                
                // Tear down the cahce, including telling the server we're no longer
                // observing the data
            }
            else if (cachedData.isReadyForTearDown()) {
                console.log(`Tearing down cache ${key}`)
                cachedData.flush()
                delete this.cacheByTupleSelector[key]
                this.tellServerWeWantData(
                    [cachedData.tupleSelector],
                    null,
                    true
                )
                
                // if there are no subscribers, then mark it for tear down (30s time)
            }
            else {
                cachedData.markForTearDown()
                
            }
            
        }
    }
    
    private vortexOnlineChanged(): void {
        this.cleanupDeadCaches()
        let tupleSelectors: TupleSelector[] = []
        for (let key of dictKeysFromObject(this.cacheByTupleSelector)) {
            let cache = this.cacheByTupleSelector[key]
            if (cache.askServerEnabled)
                tupleSelectors.push(TupleSelector.fromJsonStr(key))
        }
        this.tellServerWeWantData(tupleSelectors)
    }
    
    private receivePayload(
        payload: Payload,
        encodedPayload: string
    ): void {
        let tupleSelector = payload.filt["tupleSelector"]
        let tsStr = tupleSelector.toOrderedJsonStr()
        
        if (!this.cacheByTupleSelector.hasOwnProperty(tsStr))
            return
        
        let cachedData = this.cacheByTupleSelector[tsStr]
        
        let lastDate = cachedData.lastServerPayloadDate
        
        if (payload.date == null) {
            throw new Error("payload.date can not be null")
        }
        let thisDate = moment(payload.date)
        
        // If the data is old, then disregard it.
        if (lastDate != null && lastDate.isAfter(thisDate))
            return
        
        cachedData.lastServerPayloadDate = thisDate
        cachedData.tuples = payload.tuples
        
        this.notifyObserversAndStore(cachedData, tupleSelector, payload.tuples, encodedPayload)
    }
    
    private tellServerWeWantData(
        tupleSelectors: TupleSelector[],
        disableCache: boolean | null = false,
        unsubscribe: boolean = false
    ): void {
        if (!this.vortexStatusService.snapshot.isOnline)
            return
        
        let startFilt = extend({"subscribe": true}, this.filt)
        
        let payloads: Payload[] = []
        for (let tupleSelector of tupleSelectors) {
            let tsStr = tupleSelector.toOrderedJsonStr()
            
            if (this.cacheByTupleSelector.hasOwnProperty(tsStr))
                this.cacheByTupleSelector[tsStr].lastServerAskDate = moment()
            
            let filt = extend({}, startFilt, {
                "tupleSelector": tupleSelector,
                "unsubscribe": unsubscribe
            })
            
            if (disableCache != null)
                filt["disableCache"] = disableCache
            
            payloads.push(new Payload(filt))
        }
        this.vortexService.sendPayload(payloads)
    }
    
    private notifyObservers(
        cachedData: CachedSubscribedData,
        tupleSelector: TupleSelector,
        tuples: Tuple[]
    ): void {
        // Notify Observers
        try {
            cachedData.subject.next(tuples)
            
        }
        catch (e) {
            // NOTE: Observables automatically remove observers when the raise exceptions.
            console.log(`ERROR: TupleDataObserverService.notifyObservers, observable has been removed
            ${e.toString()}
            ${tupleSelector.toOrderedJsonStr()}`)
        }
        
    }
    
    private notifyObserversAndStore(
        cachedData: CachedSubscribedData,
        tupleSelector: TupleSelector,
        tuples: Tuple[],
        encodedPayload: string | null = null
    ): void {
        
        this.notifyObservers(cachedData, tupleSelector, tuples)
        
        // AND store the data locally
        if (cachedData.storageEnabled)
            this.storeDataLocally(tupleSelector, tuples, encodedPayload)
    }
    
    private storeDataLocally(
        tupleSelector: TupleSelector,
        tuples: Tuple[],
        encodedPayload: string | null = null
    ): Promise<void> {
        
        let errFunc = (err: string) => {
            this.vortexStatusService.logError(`saveTuples failed : ${err}`)
            throw new Error(err)
        }
        
        if (encodedPayload == null) {
            return this.tupleOfflineStorageService.saveTuples(tupleSelector, tuples)
                .catch(errFunc)
        }
        
        return this.tupleOfflineStorageService.saveTuplesEncoded(tupleSelector, encodedPayload)
            .catch(errFunc)
    }
}

