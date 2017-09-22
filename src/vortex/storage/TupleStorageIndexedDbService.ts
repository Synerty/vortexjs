import {Injectable} from "@angular/core";
import {dateStr} from "../UtilMisc";
import {TupleStorageServiceABC, TupleStorageTransaction} from "./TupleStorageServiceABC";
import {TupleOfflineStorageNameService} from "../TupleOfflineStorageNameService";
import {TupleSelector} from "../TupleSelector";
import {Tuple} from "../Tuple";
import {Payload} from "../Payload";
import {indexedDB, addIndexedDbHandlers, IDBException} from "./IndexedDb";



// ----------------------------------------------------------------------------


// ----------------------------------------------------------------------------

function now(): any {
    return new Date();
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
export class TupleStorageIndexedDbService extends TupleStorageServiceABC {
    db: any;
    private openInProgressPromise: Promise<void> | null = null;


    constructor(name: TupleOfflineStorageNameService) {
        super(name);


    }

    // ----------------------------------------------------------------------------
    // Open the indexed db database
    open(): Promise<void> {
        if (this.openInProgressPromise != null)
            return this.openInProgressPromise;


        this.openInProgressPromise = new Promise<void>((resolve, reject) => {

            // DISP Store

            let request = indexedDB.open(this.dbName, 1);
            addIndexedDbHandlers(request, () => {
                let msg = `${dateStr()} IndexedDB : "${this.dbName}" `
                    + `Failed to open IndexedDB database`;
                this.openInProgressPromise = null;
                reject(msg);
                throw new IDBException(msg);
            });

            request.onsuccess = (event) => {
                console.log(`${dateStr()} IndexedDB : "${this.dbName}" Success opening DB`);
                if (this.db == null) {
                    this.db = event.target.result;
                    this.openInProgressPromise = null;
                    resolve();
                }
            };

            request.onupgradeneeded = (event) => {
                console.log(`${dateStr()} IndexedDB : "${this.dbName}" Upgrading`);
                let db = event.target.result;

                // SCHEMA for database points
                // Schema Version 1
                db.createObjectStore(TUPLE_STORE, {keyPath: "tupleSelector"});

                console.log(`${dateStr()} IndexedDB : "${this.dbName}" Upgrade Success`);
            };
        });
        return this.openInProgressPromise;
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

                let timeTaken = now() - startTime;
                console.log(
                    `${dateStr()} IndexedDB: loadTuples took ${timeTaken}ms (in thread)`
                );

                // Called for each matching record
                let data: DataStructI | null = request.result;
                if (data == null) {
                    resolve([]);
                    return;
                }

                Payload.fromVortexMsg(data.payload)
                    .then((payload: Payload) => resolve(payload.tuples))
                    .catch(e => reject(e));

            };
        });

    }


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
        return new Payload({}, tuples).toVortexMsg()
            .then((vortexMsg: string) => {
                let tupleSelectorStr = tupleSelector.toOrderedJsonStr();

                let item: DataStructI = {
                    tupleSelector: tupleSelectorStr,
                    dateTime: new Date(),
                    payload: vortexMsg
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