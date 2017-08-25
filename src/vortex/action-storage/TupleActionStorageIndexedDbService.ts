import {Injectable} from "@angular/core";
import {dateStr} from "../UtilMisc";
import {Payload} from "../Payload";
import {TupleActionStorageServiceABC} from "./TupleActionStorageServiceABC";
import {addIndexedDbHandlers, IDBException, indexedDB} from "../storage/IndexedDb";
import {TupleActionABC} from "../TupleAction";

// ----------------------------------------------------------------------------

function now(): any {
    return new Date();
}

const DB_NAME = "tupleActions";
const ACTION_STORE = "tupleActions";
const ACTION_KEY_PATH = "scopeUuid";

interface TupleActionStorageStructI {
    scope: string;
    scopeUuid: string;
    encodedPayload: string;
}

/** Tuple Storage IndexedDB
 *
 * This class handles storing and retrieving tuples to/from indexed db.
 *
 */
@Injectable()
export class TupleActionStorageIndexedDbService extends TupleActionStorageServiceABC {
    private db: any;
    private openInProgressPromise: Promise<void> | null = null;


    constructor() {
        super();


    }


    storeAction(scope: string, tupleAction: TupleActionABC, payload: Payload): Promise<void> {
        let startTime = now();

        let retval = this.transaction(true)
            .then((tx) => {
                let store = tx.objectStore(ACTION_STORE);

                return new Payload({}, [tupleAction]).toVortexMsg()
                    .then((vortexMsg) => {

                        let item: TupleActionStorageStructI = {
                            scope: scope,
                            scopeUuid: `${scope}|${tupleAction.uuid}`,
                            encodedPayload: vortexMsg
                        };


                        let timeTaken = now() - startTime;
                        console.log(`${dateStr()} IndexedDB: toVortexMsg took ${timeTaken}ms `);

                        startTime = now();

                        return new Promise<void>((resolve, reject) => {

                            // Run the inserts
                            let response = store.put(item);

                            addIndexedDbHandlers(response, () => {
                                reject(`${dateStr()} IndexedDB: saveTuples "put" error`);
                                throw new IDBException("Put error");
                            });

                            response.oncomplete = () => {
                                let timeTaken = now() - startTime;
                                console.log(`${dateStr()} IndexedDB: storeAction`
                                    + ` took ${timeTaken}ms (in thread)`);
                                resolve();
                            };
                        });
                    });
            });
        return <Promise<void> > retval;
    }

    loadNextAction(): Promise<Payload> {


        return this.transaction(false)
            .then((tx) => {
                let store = tx.objectStore(ACTION_STORE);


                return new Promise<Payload>((resolve, reject) => {

                    // Run the inserts
                    let response = store.openCursor();

                    addIndexedDbHandlers(response, () => {
                        reject(`${dateStr()} IndexedDB: saveTuples "put" error`);
                        throw new IDBException("Put error");
                    });

                    response.oncomplete = (ev) => {
                        let cursor = response.result || ev.target.result;
                        if (!!cursor == false) {
                            resolve(new Payload());
                            return;
                        }

                        Payload.fromVortexMsg(cursor.value.encodedPayload)
                            .then((payload: Payload) => {
                                resolve(payload);

                                try {
                                    tx.abort();

                                } catch (e) {
                                    console.log(e);
                                }
                            })
                            .catch(e => reject(e));

                    };
                });
            });

    }

    countActions(): Promise<number> {
        return this.transaction(false)
            .then((tx) => {
                let store = tx.objectStore(ACTION_STORE);

                return new Promise<number>((resolve, reject) => {

                    // Run the inserts
                    let response = store.count();

                    addIndexedDbHandlers(response, () => {
                        reject(`${dateStr()} IndexedDB: saveTuples "put" error`);
                        throw new IDBException("Put error");
                    });

                    response.oncomplete = () => {
                        resolve(response.result);
                    };
                });
            });
    }

    deleteAction(scope: string, actionUuid: number): Promise<void> {
        let scopeUuid = `${scope}|${actionUuid}`;

        return this.transaction(true)
            .then((tx) => {
                let store = tx.objectStore(ACTION_STORE);


                return new Promise<void>((resolve, reject) => {

                    // Run the inserts
                    let response = store.delete(scopeUuid);

                    addIndexedDbHandlers(response, () => {
                        reject(`${dateStr()} IndexedDB: saveTuples "put" error`);
                        throw new IDBException("Put error");
                    });

                    response.oncomplete = () => {
                        resolve();
                    };
                });
            });

    }

// ----------------------------------------------------------------------------
// Open the indexed db database
    open(): Promise<void> {
        if (this.isOpen()
        )
            return Promise.resolve();

        if (this.openInProgressPromise != null)
            return this.openInProgressPromise;


        this.openInProgressPromise = new Promise<void>((resolve, reject) => {

            // DISP Store

            let request = indexedDB.open(DB_NAME, 1);
            addIndexedDbHandlers(request, () => {
                let msg = `${dateStr()} IndexedDB : "${DB_NAME}" `
                    + `Failed to open IndexedDB database`;
                this.openInProgressPromise = null;
                reject(msg);
                throw new IDBException(msg);
            });

            request.onsuccess = (event) => {
                console.log(`${dateStr()} IndexedDB : "${DB_NAME}" Success opening DB`);
                if (this.db == null) {
                    this.db = event.target.result;
                    this.openInProgressPromise = null;
                    resolve();
                }
            };

            request.onupgradeneeded = (event) => {
                console.log(`${dateStr()} IndexedDB : "${DB_NAME}" Upgrading`);
                let db = event.target.result;

                // SCHEMA for database points
                // Schema Version 1
                db.createObjectStore(ACTION_STORE, {keyPath: ACTION_KEY_PATH});

                console.log(`${dateStr()} IndexedDB : "${DB_NAME}" Upgrade Success`);
            };
        });
        return this.openInProgressPromise;
    }

// ----------------------------------------------------------------------------
// Check if the DB is open
    isOpen(): boolean {

        return this.db != null;
    }

    close(): void {
        if (!
                this.isOpen()
        ) {
            throw new Error(`IndexedDB "${DB_NAME}" is not open`)
        }
        this.db.close();
        this.db = null;
    }

    transaction(forWrite: boolean): Promise<any> {
        return this.open()
            .then(() => {
                // Get the Read Only case out the way, it's easy
                return this.db.transaction(
                    ACTION_STORE, forWrite ? "readwrite" : "readonly"
                );
            });


    }
}
