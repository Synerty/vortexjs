import { PayloadDelegateABC } from "./PayloadDelegateABC"

declare let global: any

const CALL_PAYLOAD_ENCODE = 1
const CALL_PAYLOAD_DECODE = 2
const CALL_PAYLOAD_ENVELOPE_ENCODE = 3
const CALL_PAYLOAD_ENVELOPE_DECODE = 4

export class PayloadDelegateNs extends PayloadDelegateABC {
    private static readonly MAX_WORKERS = 8
    private workers: Worker[] = []
    private nextWorkerIndex: number = 0
    
    constructor() {
        super()
        
        for (let i = 0; i < PayloadDelegateNs.MAX_WORKERS; i++)
            this.workers.push(this.createWorker())
    }
    
    private nextWorker(): Worker {
        let worker: Worker = this.workers[this.nextWorkerIndex]
        if (PayloadDelegateNs.MAX_WORKERS == ++this.nextWorkerIndex)
            this.nextWorkerIndex = 0
        return worker
    }
    
    // noinspection JSMethodCanBeStatic
    private createWorker(): Worker {
        let worker: Worker
        worker = new Worker("./PayloadDelegateNsWorker.js")
        worker.onmessage = PayloadDelegateNs.onMessage
        worker.onerror = PayloadDelegateNs.onError
        return worker
    }
    
    // ------------------------------------------------------------------------
    
    deflateAndEncode(payloadJson: string): Promise<string> {
        let {callNumber, promise} = this.pushPromise()
        
        this.nextWorker()
            .postMessage({
                call: CALL_PAYLOAD_ENCODE,
                callNumber: callNumber,
                payloadJson: payloadJson
            })
        
        return promise
        
    }
    
    // ------------------------------------------------------------------------
    
    decodeAndInflate(vortexStr: string): Promise<string> {
        let {callNumber, promise} = this.pushPromise()
        
        this.nextWorker()
            .postMessage({
                call: CALL_PAYLOAD_DECODE,
                callNumber: callNumber,
                vortexStr: vortexStr
            })
        
        return promise
        
    }
    
    // ------------------------------------------------------------------------
    
    encodeEnvelope(payloadEnvelopeJson: string): Promise<string> {
        let {callNumber, promise} = this.pushPromise()
        
        this.nextWorker()
            .postMessage({
                call: CALL_PAYLOAD_ENVELOPE_ENCODE,
                callNumber: callNumber,
                payloadEnvelopeJson: payloadEnvelopeJson
            })
        
        return promise
        
    }
    
    // ------------------------------------------------------------------------
    
    decodeEnvelope(vortexStr: string): Promise<string> {
        let {callNumber, promise} = this.pushPromise()
        
        this.nextWorker()
            .postMessage({
                call: CALL_PAYLOAD_ENVELOPE_DECODE,
                callNumber: callNumber,
                vortexStr: vortexStr
            })
        
        return promise
    }
    
    // ------------------------------------------------------------------------
    
    private static _promises = {}
    private static _promisesNum = 1
    
    private pushPromise(): { callNumber: any; promise: Promise<any> } {
        let callNumber = PayloadDelegateNs._promisesNum++
        
        // Roll it over
        if (PayloadDelegateNs._promisesNum > 10000) // 10 thousand
            PayloadDelegateNs._promisesNum = 1
        
        let promise = new Promise((
            resolve,
            reject
        ) => {
            PayloadDelegateNs._promises[callNumber] = {
                resolve: resolve,
                reject: reject
            }
        })
        
        return {callNumber, promise}
    }
    
    private static popPromise(callNumber: number): {} {
        let promise = PayloadDelegateNs._promises[callNumber]
        delete PayloadDelegateNs._promises[callNumber]
        return promise
    }
    
    private static onMessage(postResult) {
        let resultAny: any = postResult.data
        // console.log(`PayloadDelegateNS, Receiving : ${JSON.stringify(resultAny)}`);
        
        let error = resultAny["error"]
        let callNumber = resultAny["callNumber"]
        let result = resultAny["result"]
        
        if (callNumber == null) {
            console.log(`PayloadDelegateNs.onerror ${error}`)
            return
        }
        
        let promise = PayloadDelegateNs.popPromise(callNumber)
        
        if (promise == null) {
            console.log(`PayloadDelegateNs, Double worker callback ${error}`)
            return
        }
        
        let resolve = promise["resolve"]
        let reject = promise["reject"]
        
        if (error == null) {
            setTimeout(() => resolve(result), 0)
            
        }
        else {
            reject(error)
        }
    }
    
    private static onError(error) {
        console.log(`PayloadDelegateNs.onerror ${error}`)
    }
    
}
