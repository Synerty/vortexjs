import { forwardRef, Inject, Injectable } from "@angular/core"
import { VortexStatusService } from "../VortexStatusService"
import { TupleActionABC } from "../TupleAction"
import { Tuple } from "../exports"
import { VortexService } from "../VortexService"
import { PayloadResponse } from "../PayloadResponse"
import { Payload } from "../Payload"
import { extend } from "../UtilMisc"
import { PayloadEnvelope } from "../PayloadEnvelope"

export class TupleActionPushNameService {
    constructor(
        public name: string,
        public additionalFilt: any = {}
    ) {
    }
}

@Injectable()
export class TupleActionPushService {
    constructor(
        @Inject(forwardRef(() => TupleActionPushNameService)) public tupleActionProcessorName,
        @Inject(forwardRef(() => VortexService)) public vortexService,
        @Inject(forwardRef(() => VortexStatusService)) public vortexStatus,
    ) {
    }
    
    /** Push Action
     *
     * This pushes the action, either locally or to the server, depending on the
     * implementation.
     *
     * If pushed locally, the promise will resolve when the action has been saved.
     * If pushed directly to the server, the promise will resolve when the server has
     * responded.
     */
    pushAction(tupleAction: TupleActionABC): Promise<Tuple[]> {
        if (!this.vortexStatus.snapshot.isOnline)
            return Promise.reject("Vortex is offline")
        
        let promise: any = this.makePayload(tupleAction)
            .makePayloadEnvelope()
        
        promise = promise.then((payloadEnvelope: PayloadEnvelope) => {
            return new PayloadResponse(this.vortexService, payloadEnvelope)
        })
        
        promise = promise.then((payloadEnvelope: PayloadEnvelope) => {
            return payloadEnvelope.decodePayload()
        })
        
        promise = promise.then((payload: Payload) => payload.tuples)
        
        return promise
    }
    
    /** Make Payload
     *
     * This make the payload that we send to the server.
     *
     */
    protected makePayload(tupleAction: TupleActionABC): Payload {
        if (tupleAction == null) {
            throw new Error("pushAction: tupleAction is null")
        }
        
        let payload = new Payload()
        
        payload.filt = extend({
            key: "tupleActionProcessorName",
            name: this.tupleActionProcessorName.name
        }, this.tupleActionProcessorName.additionalFilt)
        
        payload.tuples = [tupleAction]
        
        return payload
    }
}
