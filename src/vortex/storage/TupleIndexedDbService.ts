import {Injectable} from "@angular/core";
import {dateStr} from "../UtilMisc";
import {TupleStorageServiceABC, TupleStorageTransaction} from "./TupleStorageServiceABC";
import {TupleOfflineStorageNameService} from "../TupleOfflineStorageNameService";
import {TupleSelector} from "../TupleSelector";
import {Tuple} from "../Tuple";
import {Payload} from "../Payload";

// ----------------------------------------------------------------------------

declare let window: any;

let indexedDB: any = window.indexedDB || window.mozIndexedDB
    || window.webkitIndexedDB || window.msIndexedDB;

let IDBTransaction: any = window.IDBTransaction
    || window.webkitIDBTransaction || window.msIDBTransaction;

let IDBKeyRange: any = window.IDBKeyRange
    || window.webkitIDBKeyRange || window.msIDBKeyRange;


export function supportsIndexedDb(): boolean {
    return !!indexedDB;
}

// ----------------------------------------------------------------------------

function now(): any {
    return new Date();
}

class IDBException {
    constructor(public message: string) {
    }

    toString() {
        return 'IndexedDB : IDBException: ' + this.message;
    }
}

function addIndexedDbHandlers(request, stacktraceFunctor) {
    request.onerror = (request) => {
        console.log(dateStr() + "IndexedDB : ERROR " + request.target.error);
        this.balloonMsg.showError("IndexedDB : ERROR " + request.target.error);
        stacktraceFunctor();
    };

    request.onabort = (request) => {
        console.log(dateStr() + "IndexedDB : ABORT " + request.target.error);
        this.balloonMsg.showError("IndexedDB : ABORT " + request.target.error);
        stacktraceFunctor();
    };

    request.onblock = (request) => {
        console.log(dateStr() + "IndexedDB : BLOCKED " + request.target.error);
        this.balloonMsg.showError("IndexedDB : BLOCKED " + request.target.error);
        stacktraceFunctor();
    };

}

const TUPLE_STORE = "tuples";

interface DataStructI {
    tupleSelector: string;
    dateTime: Date;
    payload: string;
}

/** Tuple Storage IndexedDB
 *
 * This class handles storing and retrieving tuples to/from indexed db.
 *
 */
@Injectable()
export class TupleIndexedDbService extends TupleStorageServiceABC {
    db: any;


    constructor(name: TupleOfflineStorageNameService) {
        super(name);


    }

    // ----------------------------------------------------------------------------
    // Open the indexed db database
    open(): Promise<void> {
        return new Promise<void>((resolve, reject) => {

            // DISP Store

            let request = indexedDB.open(this.dbName, 1);
            addIndexedDbHandlers(request, () => {
                let msg = `${dateStr()} IndexedDB : "${this.dbName}" `
                    + `Failed to open IndexedDB database`;
                reject(msg);
                throw new IDBException(msg);
            });

            request.onsuccess = (event) => {
                console.log(`${dateStr()} IndexedDB : "${this.dbName}" Success opening DB`);
                if (this.db == null) {
                    this.db = event.target.result;
                    resolve();
                }
            };

            request.onupgradeneeded = (event) => {
                console.log(`${dateStr()} IndexedDB : "${this.dbName}" Upgrading`);
                let db = event.target.result;

                // SCHEMA for database points
                let gridStore = db.createObjectStore(TUPLE_STORE,
                    {keyPath: "tupleSelector"});

                console.log(`${dateStr()} IndexedDB : "${this.dbName}" Upgrade Success`);

                if (this.db == null) {
                    this.db = db;
                    resolve();
                }
            };
        });
    }

    // ----------------------------------------------------------------------------
    // Check if the DB is open
    isOpen(): boolean {

        return this.db != null;
    };

    close(): void {
        if (!this.isOpen()) {
            throw new Error(`IndexedDB "${this.dbName}" is not open`)
        }
        this.db.close();
        this.db = null;
    }

    transaction(forWrite: boolean): Promise<TupleStorageTransaction> {
        if (!this.isOpen())
            throw new Error(`IndexedDB ${this.dbName} is not open`);

        // Get the Read Only case out the way, it's easy
        let mode = forWrite ? "readwrite" : "readonly";
        return Promise.resolve(
            new TupleIndexedDbTransaction(
                this.db.transaction(TUPLE_STORE, mode), forWrite
            )
        );

    }
}


class TupleIndexedDbTransaction implements TupleStorageTransaction {
    private store: any;

    constructor(private tx: IDBTransaction, private txForWrite: boolean) {
        this.store = this.tx.objectStore(TUPLE_STORE);
    }

// ----------------------------------------------------------------------------
// Load the display items from the cache
    loadTuples(tupleSelector: TupleSelector): Promise<Tuple[]> {
        let startTime: any = now();

        return new Promise<Tuple[]>((resolve, reject) => {

            let request = this.store.get(tupleSelector.toOrderedJsonStr());

            addIndexedDbHandlers(request, () => {
                let msg = `${dateStr()} IndexedDB: Index open cursor`;
                reject(msg);
                throw new IDBException(msg);
            });

            request.onsuccess = () => {

                let tuples = [];

                let timeTaken = now() - startTime;
                console.log(
                    `${dateStr()} IndexedDB: loadTuples took ${timeTaken}ms (in thread)`
                );

                // Called for each matching record
                let data: DataStructI | null = request.result;
                if (data != null) {
                    let startTime = now();
                    tuples = Payload.fromVortexMsg(data.payload).tuples;
                    let timeTaken = now() - startTime;
                    console.log(
                        `${dateStr()} IndexedDB: fromVortexMsg took ${timeTaken}ms `
                    );
                }


                resolve(tuples);
            };
        });

    };


// ----------------------------------------------------------------------------
// Add disply items to the cache

    saveTuples(tupleSelector: TupleSelector, tuples: Tuple[]): Promise<void> {

        if (!this.txForWrite) {
            let msg = "IndexedDB: saveTuples attempted on read only TX";
            console.log(`${dateStr()} ${msg}`);
            return Promise.reject(msg)
        }

        let startTime = now();

        // The payload is a convenient way to serialise and compress the data
        let payloadData = new Payload({}, tuples).toVortexMsg();
        let tupleSelectorStr = tupleSelector.toOrderedJsonStr();

        let item: DataStructI = {
            tupleSelector: tupleSelectorStr,
            dateTime: new Date(),
            payload: payloadData
        };


        let timeTaken = now() - startTime;
        console.log(`${dateStr()} IndexedDB: toVortexMsg took ${timeTaken}ms `);

        startTime = now();

        return new Promise<void>((resolve, reject) => {

            // Run the inserts
            let response = this.store.put(item);

            addIndexedDbHandlers(response, () => {
                reject(`${dateStr()} IndexedDB: saveTuples "put" error`);
                throw new IDBException("Put error");
            });

            response.oncomplete = () => {
                let timeTaken = now() - startTime;
                console.log(`${dateStr()} IndexedDB: saveTuples`
                    + ` took ${timeTaken}ms (in thread)`
                    + ` Inserted/updated ${tuples.length} tuples`);
                resolve();
            };
        });

    };

    close(): Promise<void> {
        return Promise.resolve();

        /* Close transaction ???

         addIndexedDbHandlers(this.tx, () => {
         reject();
         throw new IDBException("Transaction error");
         });

         // LOOK HERE, I'm looking at the WebSQL and IndexedDb implementation and both
         // appear to only provide single use transactions like this.
         // Considering that fact, The "TupleTransaction" api seems useless.
         this.tx.oncomplete = () => {
         let timeTaken = now() - startTime;
         console.log(`${dateStr()} IndexedDB: saveTuples`
         + ` took ${timeTaken}ms (in thread)`
         + ` Inserted/updated ${tuples.length} tuples`);
         resolve();
         };

         */

    }
}