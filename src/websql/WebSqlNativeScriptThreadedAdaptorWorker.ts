let NsSqlite = require("nativescript-sqlite/sqlite")

declare let global: any

let db: any = null
let schemaInstalled: any = false

const CALL_DB_OPEN = 1
const CALL_DB_CLOSE = 2
const CALL_DB_EXECUTE = 3

function postError(
    callNumber: number,
    err: any
): void {
    let postArg = {
        callNumber: callNumber,
        result: null,
        error: err
    }
    //console.log(`WebSQL Worker, Sending ${postArg}`);
    global.postMessage(postArg)
}

function postResult(
    callNumber: number,
    result: any
): void {
    let postArg = {
        callNumber: callNumber,
        result: result,
        error: null
    }
    //console.log(`WebSQL Worker, Sending ${postArg}`);
    global.postMessage(postArg)
}

global.onmessage = (postedArg) => {
    let params: any = postedArg["data"]
    //console.log(`WebSQL Worker, Received : ${JSON.stringify(params)}`);
    let call: number = params["call"]
    let callNumber: number = params["callNumber"]
    
    try {
        switch (call) {
            case CALL_DB_OPEN: // Open DB
                return openDb(callNumber, params["dbName"], params["dbSchema"], params["dbVersion"])
            
            case CALL_DB_CLOSE: // Close DB
                if (!db)
                    return
                db.close()
                db = null
                return postResult(callNumber, null)
            
            case CALL_DB_EXECUTE: // Execute SQL
                return executeSql(callNumber, params["sql"], params["bindParams"])
            
        }
    }
    catch (e) {
        return postError(callNumber, e.toString())
    }
    
}

global.onerror = postError

function openDb(
    callNumber: number,
    dbName: string,
    dbSchema: string[],
    dbVersion: string
): void {
    new NsSqlite(dbName)
        .then((dbArg) => {
            db = dbArg
            if (!NsSqlite.isSqlite(db))
                return postError(callNumber, "The thing we opened isn't a DB")
            
            db.resultType(NsSqlite.RESULTSASOBJECT)
            db.version(dbVersion) // MATCHES Browser Adaptor
            if (schemaInstalled)
                return postResult(callNumber, null)
            
            // TODO, Handle more than one SQL statement
            db.all(dbSchema[0])
                .catch((err) => postError(callNumber, err))
                .then(() => postResult(callNumber, null))
        })
        .catch((err) => {
            return postError(callNumber, err)
        })
}

function executeSql(
    callNumber: number,
    sql: string,
    bindParams: any
): void {
    if (db == null)
        return postError(callNumber, "Database has been closed")
    
    db.all(sql, bindParams)
        .then(result => postResult(callNumber, result))
        .catch(err => postError(callNumber, err))
}
