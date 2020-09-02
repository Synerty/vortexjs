import { PayloadEndpoint } from "./PayloadEndpoint"
import { PayloadEnvelope } from "./PayloadEnvelope"

export let STOP_PROCESSING = "STOP_PROCESSING"

export class PayloadIO {
    private _endpoints: PayloadEndpoint[]
    
    constructor() {
        let self = this
        self._endpoints = []
    }
    
    add(endpoint) {
        let self = this
        self._endpoints.add(endpoint)
    }
    
    remove(endpoint) {
        let self = this
        self._endpoints.remove(endpoint)
    }
    
    process(payloadEnvelope: PayloadEnvelope) {
        let self = this
        // Make a copy of the endpoints array, it may change endpoints
        // can remove them selves during iteration.
        let endpoints = self._endpoints.slice(0)
        for (let i = 0; i < endpoints.length; ++i) {
            if (endpoints[i].process(payloadEnvelope) === STOP_PROCESSING)
                break
        }
    }
    
}

export let payloadIO = new PayloadIO()
