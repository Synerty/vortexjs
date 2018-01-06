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

    constructor(protected dbName: string, protected dbSchema: string[]) {
        super(dbName, dbSchema);

        if (global.TNS_WEBPACK) {
            let Worker = require("nativescript-worker-loader!./WebSqlNativeScriptThreadedAdaptorWorker.js");
            this.worker = new Worker();
        } else {
            this.worker = new Worker("./WebSqlNativeScriptThreadedAdaptorWorker.js");
        }

    }

    open(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.isOpen()) {
                resolve();
                return;
            }

            function callError(error) {
                reject(error);
                console.log(
                    `ERROR: WebSqlNativeScriptThreadedAdaptorService.open ${error}`
                );
            }

            this.worker.onmessage = (postResult) => {
                let resultAny: any = postResult.data;
                //console.log(`WebSQL Service, DB Receiving : ${JSON.stringify(resultAny)}`);
                let error = resultAny["error"];

                if (error == null) {
                    this._isOpen = true;
                    this.worker.onerror = WebSqlNativeScriptThreadedAdaptorService.onError;
                    this.worker.onmessage = WebSqlNativeScriptThreadedAdaptorService.onMessage;
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
        return this.worker != null && this._isOpen;;
    }

    close(): void {
        this.worker.terminate();
        this.worker = null;
    }

    transaction(): Promise<WebSqlTransaction> {
        // NOT THE COMMERCIAL VERSION, NO TRANSACTION SUPPORT IS AVAILABLE
        if (!this.isOpen())
            throw new Error(`SQLDatabase ${this.dbName} is not open`);

        return new Promise<WebSqlTransaction>((resolve, reject) => {
            resolve(new WebSqlNativeScriptThreadedTransactionAdaptor(this.worker));
        });
    }

    // ------------------------------------------------------------------------

    static _promises = {};
    static _promisesNum = 1;

    static popPromise(callNumber: number): {} {
        let promise = WebSqlNativeScriptThreadedAdaptorService._promises[callNumber];
        delete WebSqlNativeScriptThreadedAdaptorService._promises[callNumber];
        return promise;
    }

    static pushPromise(callNumber: number, resolve, reject): void {
        WebSqlNativeScriptThreadedAdaptorService._promises[callNumber] = {
            resolve: resolve,
            reject: reject
        };
    }

    static onMessage(postResult) {
        let resultAny: any = postResult.data;
        // console.log(`WebSQL Service, Tx Receiving : ${JSON.stringify(resultAny)}`);

        let error = resultAny["error"];
        let callNumber = resultAny["callNumber"];
        let result = resultAny["result"];

        let promise = WebSqlNativeScriptThreadedAdaptorService.popPromise(callNumber);
        let resolve = promise["resolve"];
        let reject = promise["reject"];

        if (error == null) {
            resolve(result);

        } else {
            reject(error);
        }
    }

    static onError(error) {
        console.log(`WebSqlNativeScriptThreadedAdaptorService.onerror ${error}`);
    }
}

class WebSqlNativeScriptThreadedTransactionAdaptor implements WebSqlTransaction {
    constructor(private worker: any) {

    }

    executeSql(sql: string, bindParams: any[] | null = []): Promise<null | any[]> {
        let callNumber = WebSqlNativeScriptThreadedAdaptorService._promisesNum++;

        return new Promise((resolve, reject) => {
            let postArg = {
                call: 3,
                callNumber: callNumber,
                sql: sql,
                bindParams: bindParams
            };
            //console.log(`WebSQL Transaction, Sending : ${JSON.stringify(postArg)}`);
            this.worker.postMessage(postArg);

            WebSqlNativeScriptThreadedAdaptorService.pushPromise(callNumber, resolve, reject);
        })
    }


}
