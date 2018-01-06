import { Injectable } from "@angular/core";

import { WebSqlFactoryService, WebSqlService, WebSqlTransaction } from "./WebSqlService";

declare let global: any;

@Injectable()
export class WebSqlNativeScriptThreadedFactoryService implements WebSqlFactoryService {

    hasStorageLimitations(): boolean {
        return false; // NOPE :-)
    }

    supportsWebSql(): boolean {
        return true; // Yes :-)
    }

    createWebSql(dbName: string, dbSchema: string[]): WebSqlService {
        return new WebSqlNativeScriptThreadedAdaptorService(dbName, dbSchema);
    }
}

@Injectable()
class WebSqlNativeScriptThreadedAdaptorService extends WebSqlService {
    private worker: Worker;
    private _isOpen: boolean = false;

    private _callQueue:any[] = [];
    private _callInProgress:boolean = false;

    static openDatabaseNames:string[] = [];

    public _promises = {};
    public _promisesNum = 1;

    constructor(protected dbName: string, protected dbSchema: string[]) {
        super(dbName, dbSchema);

        if (global.TNS_WEBPACK) {
            let Worker = require("nativescript-worker-loader!./WebSqlNativeScriptThreadedAdaptorWorker.js");
            this.worker = new Worker();
        } else {
            this.worker = new Worker("./WebSqlNativeScriptThreadedAdaptorWorker.js");
        }

        if (WebSqlNativeScriptThreadedAdaptorService.openDatabaseNames.indexOf(dbName) != -1) {
          let msg = `A database with name ${dbName} exists`;
          console.log(`ERROR: ${msg}`);
          throw new Error(msg);
        }

        WebSqlNativeScriptThreadedAdaptorService.openDatabaseNames.push(dbName);
    }

    open(): Promise<void> {
        if (this.worker == null) {
            throw new Error("A database service can not be opened twice");
        }

        return new Promise<void>((resolve, reject) => {
            if (this.isOpen()) {
                resolve();
                return;
            }

            function callError(error) {
                reject(error);
                console.log(
                    `ERROR: this.open ${error}`
                );
            }

            this.worker.onmessage = (postResult) => {
                let resultAny: any = postResult.data;
                //console.log(`WebSQL Service, DB Receiving : ${JSON.stringify(resultAny)}`);
                let error = resultAny["error"];

                if (error == null) {
                    this._isOpen = true;
                    this.worker.onerror = data => this.onError(data);
                    this.worker.onmessage = err => this.onMessage(err);
                    resolve();

                } else {
                    callError(error);
                }
            };

            this.worker.onerror = (error) => {
                console.log(`WebSQL Service, DB Erroring : ${error}`);
                callError(error);
            };

            let postArg = {
                call: 1,
                dbName: this.dbName,
                dbSchema: this.dbSchema[0],
                version: 1
            };
            //console.log(`WebSQL Service, Sending : ${JSON.stringify(postArg)}`);
            this.worker.postMessage(postArg);

        });
    }

    isOpen(): boolean {
        return this.worker != null && this._isOpen;
    }

    close(): void {
        WebSqlNativeScriptThreadedAdaptorService.openDatabaseNames.remove(this.dbName);

        this.worker.terminate();
        this.worker = null;
    }

    transaction(): Promise<WebSqlTransaction> {
        // NOT THE COMMERCIAL VERSION, NO TRANSACTION SUPPORT IS AVAILABLE
        if (!this.isOpen())
            throw new Error(`SQLDatabase ${this.dbName} is not open`);

        return new Promise<WebSqlTransaction>((resolve, reject) => {
            resolve(new WebSqlNativeScriptThreadedTransactionAdaptor(this));
        });
    }

    // ------------------------------------------------------------------------

    queueCall(call:any):void {
        //console.log(`WebSQL Transaction, Sending : ${JSON.stringify(postArg)}`);
        this._callQueue.push(call);
        this.callNext();
    }

    callNext():void {
        if (this._callInProgress)
          return;

        if (this._callQueue.length == 0)
          return;

        let nextCall = this._callQueue.unshift();
        this.worker.postMessage(nextCall);
        this._callInProgress = true;
    }

    // ------------------------------------------------------------------------


    private popPromise(callNumber: number): {} {
        let promise = this._promises[callNumber];
        delete this._promises[callNumber];
        return promise;
    }

     pushPromise(callNumber: number, resolve, reject): void {
        this._promises[callNumber] = {
            resolve: resolve,
            reject: reject
        };
    }

    private onMessage(postResult) {
        let resultAny: any = postResult.data;
        // console.log(`WebSQL Service, Tx Receiving : ${JSON.stringify(resultAny)}`);

        let error = resultAny["error"];
        let callNumber = resultAny["callNumber"];
        let result = resultAny["result"];
        let service = resultAny["service"];

        let promise = this.popPromise(callNumber);
        let resolve = promise["resolve"];
        let reject = promise["reject"];

        if (error == null) {
            resolve(result);
        } else {
            reject(error);
        }

        service.callNext();
    }

    private onError(error) {
        console.log(`ERROR : this.onerror ${error}`);
        this.callNext();
    }
}

class WebSqlNativeScriptThreadedTransactionAdaptor implements WebSqlTransaction {
    constructor(private service: WebSqlNativeScriptThreadedAdaptorService) {

    }

    executeSql(sql: string, bindParams: any[] | null = []): Promise<null | any[]> {
        let callNumber = this.service._promisesNum++;

        return new Promise((resolve, reject) => {
            let postArg = {
                call: 3,
                callNumber: callNumber,
                sql: sql,
                bindParams: bindParams
            };

            this.service.queueCall(postArg);
            this.service.pushPromise(callNumber, resolve, reject);
        })
    }


}
