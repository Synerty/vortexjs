import { Injectable } from "@angular/core"

import { WebSqlFactoryService, WebSqlService, WebSqlTransaction } from "./WebSqlService"

declare let global: any

const CALL_DB_OPEN = 1
const CALL_DB_CLOSE = 2
const CALL_DB_EXECUTE = 3

@Injectable()
export class WebSqlNativeScriptThreadedFactoryService implements WebSqlFactoryService {
    
    hasStorageLimitations(): boolean {
        return false // NOPE :-)
    }
    
    supportsWebSql(): boolean {
        return true // Yes :-)
    }
    
    createWebSql(
        dbName: string,
        dbSchema: string[]
    ): WebSqlService {
        return new WebSqlNativeScriptThreadedAdaptorService(dbName, dbSchema)
    }
}

@Injectable()
class WebSqlNativeScriptThreadedAdaptorService extends WebSqlService {
    private workerController: _WorkerController = new _WorkerController()
    private _isOpen: boolean = false
    
    constructor(
        protected dbName: string,
        protected dbSchema: string[]
    ) {
        super(dbName, dbSchema)
        
    }
    
    open(): Promise<void> {
        if (this.isOpen())
            return Promise.resolve()
        
        return this.workerController
            .openDb(this.dbName, this.dbSchema, "1")
            .then(() => {
                this._isOpen = true
            })
    }
    
    isOpen(): boolean {
        return this.workerController != null && this._isOpen
    }
    
    close(): void {
        this.workerController.close()
        this.workerController = null
    }
    
    transaction(): Promise<WebSqlTransaction> {
        // NOT THE COMMERCIAL VERSION, NO TRANSACTION SUPPORT IS AVAILABLE
        if (!this.isOpen())
            throw new Error(`SQLDatabase ${this.dbName} is not open`)
        
        return new Promise<WebSqlTransaction>((
            resolve,
            reject
        ) => {
            resolve(new WebSqlNativeScriptThreadedTransactionAdaptor(this.workerController))
        })
    }
}

class WebSqlNativeScriptThreadedTransactionAdaptor implements WebSqlTransaction {
    constructor(private workerController: _WorkerController) {
    
    }
    
    executeSql(
        sql: string,
        bindParams: any[] | null = []
    ): Promise<null | any[]> {
        return this.workerController.execSql(sql, bindParams)
    }
    
}

class _WorkerController {
    private worker: Worker
    
    private static _promises = {}
    private static _promisesNum = 1
    
    constructor() {
        
        if (global.TNS_WEBPACK) {
            let Worker = require("nativescript-worker-loader!./WebSqlNativeScriptThreadedAdaptorWorker.js")
            this.worker = new Worker()
        }
        else {
            this.worker = new Worker("./WebSqlNativeScriptThreadedAdaptorWorker.js")
        }
        
        this.worker.onmessage = _WorkerController.onMessage
        this.worker.onerror = _WorkerController.onError
        
    }
    
    // ------------------------------------------------------------------------
    
    openDb(
        dbName: string,
        dbSchema: string[],
        dbVersion: string
    ): Promise<void> {
        if (this.worker == null)
            return Promise.reject("Worker has been closed")
        
        let {callNumber, promise} = this.pushPromise()
        let postArg = {
            call: CALL_DB_OPEN,
            callNumber: callNumber,
            dbName: dbName,
            dbSchema: dbSchema,
            dbVersion: dbVersion
        }
        // console.log(`WebSQL Opening, Sending : ${JSON.stringify(postArg)}`);
        this.worker.postMessage(postArg)
        
        return promise
    }
    
    close() {
        
        let {callNumber, promise} = this.pushPromise()
        let postArg = {
            call: CALL_DB_CLOSE,
            callNumber: callNumber
        }
        console.log(`WebSQL Closing, Sending : ${JSON.stringify(postArg)}`)
        this.worker.postMessage(postArg)
        
        promise
            .catch(err => console.log(`WebSQL Failed to close: ${err}`))
            .then(() => {
                this.worker.terminate()
                this.worker = null
            })
    }
    
    execSql(
        sql: string,
        bindParams: any[] | null
    ): Promise<null | any[]> {
        if (this.worker == null)
            return Promise.reject("Worker has been closed")
        
        let {callNumber, promise} = this.pushPromise()
        let postArg = {
            call: CALL_DB_EXECUTE,
            callNumber: callNumber,
            sql: sql,
            bindParams: bindParams
        }
        // console.log(`WebSQL Executing, Sending : ${JSON.stringify(postArg)}`);
        this.worker.postMessage(postArg)
        
        return promise
    }
    
    private pushPromise(): { callNumber: any; promise: Promise<any> } {
        let callNumber = _WorkerController._promisesNum++
        
        if (_WorkerController._promisesNum > 10000) // 10 thousand
            _WorkerController._promisesNum = 1
        
        let promise = new Promise<any>((
            resolve,
            reject
        ) => {
            _WorkerController._promises[callNumber] = {
                resolve: resolve,
                reject: reject
            }
        })
        
        return {callNumber, promise}
    }
    
    private static popPromise(callNumber: number): {} {
        let promise = _WorkerController._promises[callNumber]
        delete _WorkerController._promises[callNumber]
        return promise
    }
    
    private static onMessage(
        postResult,
        retry = 0
    ) {
        let resultAny: any = postResult.data
        // console.log(`WebSQL Worker,  Receiving : ${JSON.stringify(resultAny)}`);
        
        let error = resultAny["error"]
        let callNumber = resultAny["callNumber"]
        let result = resultAny["result"]
        
        if (callNumber == null) {
            console.log(`ERROR: _WorkerController.onerror ${error}`)
            return
        }
        
        let promise = _WorkerController.popPromise(callNumber)
        
        if (promise == null) {
            console.log(`ERROR: _WorkerController, Double worker callback ${error}`)
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
        console.log(`ERROR: _WorkerController.onerror ${error}`)
    }
}
