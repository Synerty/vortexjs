import { payloadIO } from "./PayloadIO"
import { IPayloadFilt } from "./Payload"
import { assert, dictKeysFromObject } from "./UtilMisc"
import "./UtilArray"
import { ComponentLifecycleEventEmitter } from "./ComponentLifecycleEventEmitter"
import { Observable, Subject } from "rxjs"
import { PayloadEnvelope } from "./PayloadEnvelope"

export class PayloadEndpoint {
    private _observable: Subject<PayloadEnvelope>
    
    private _filt: { key: string }
    private _lastPayloadDate: Date | null
    private _processLatestOnly: boolean
    
    constructor(
        component: ComponentLifecycleEventEmitter,
        filter: IPayloadFilt,
        processLatestOnly: boolean = false
    ) {
        let self = this
        
        self._filt = filter
        self._lastPayloadDate = null
        self._processLatestOnly = processLatestOnly === true
        
        assert(self._filt != null, "Payload filter is null")
        
        if (self._filt.key == null) {
            let e = new Error(`There is no 'key' in the payload filt \
                , There must be one for routing - ${JSON.stringify(self._filt)}`)
            console.log(e)
            throw e
        }
        
        payloadIO.add(self)
        
        // Add auto tear downs for angular scopes
        let subscription = component.onDestroyEvent.subscribe(() => {
                this.shutdown()
                subscription.unsubscribe()
            }
        )
        
        this._observable = new Subject<PayloadEnvelope>()
    }
    
    get observable(): Observable<PayloadEnvelope> {
        return this._observable
    }
    
    /**
     * Process Payload
     * Check if the payload is meant for us then process it.
     *
     * @return null, or if the function is overloaded, you could return STOP_PROCESSING
     * from PayloadIO, which will tell it to stop processing further endpoints.
     */
    process(payloadEnvelope: PayloadEnvelope): null | string {
        if (!this.checkFilt(this._filt, payloadEnvelope.filt))
            return null
        
        if (!this.checkDate(payloadEnvelope))
            return null
        
        try {
            this._observable.next(payloadEnvelope)
            
        }
        catch (e) {
            // NOTE: Observables automatically remove observers when the raise exceptions.
            console.log(`ERROR: PayloadEndpoint.process, observable has been removed
            ${e.toString()}
            ${JSON.stringify(payloadEnvelope.filt)}`)
        }
        
        return null
    };
    
    private checkFilt(
        leftFilt,
        rightFilt
    ): boolean {
        
        for (let key of dictKeysFromObject(leftFilt, true)) {
            if (!rightFilt.hasOwnProperty(key))
                return false
            
            let left = leftFilt[key]
            let right = rightFilt[key]
            
            // Handle the case of null !== undefined
            if (left == null && right == null)
                return true
            
            if (typeof left !== typeof right)
                return false
            
            // Handle special case for Arrays using our equals method in ArrayUtil
            if (left instanceof Array) {
                if (left.sort()
                    .equals(right.sort()))
                    continue
                else
                    return false
            }
            
            // Handle special case for Arrays using our equals method in ArrayUtil
            if (left instanceof Object) {
                if (this.checkFilt(left, right))
                    continue
                else
                    return false
            }
            
            if (left !== right)
                return false
        }
        
        return true
    };
    
    private checkDate(payload): boolean {
        
        if (this._processLatestOnly) {
            if (this._lastPayloadDate == null || this._lastPayloadDate < payload.date)
                this._lastPayloadDate = payload.date
            else
                return false
        }
        
        return true
    };
    
    shutdown() {
        let self = this
        payloadIO.remove(self)
        if (this._observable["observers"] != null) {
            for (let observer of this._observable["observers"]) {
                observer["unsubscribe"]()
            }
        }
    };
    
}
