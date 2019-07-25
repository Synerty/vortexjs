var NsSqlite = require("nativescript-sqlite/sqlite");
var db = null;
var schemaInstalled = false;
var CALL_DB_OPEN = 1;
var CALL_DB_CLOSE = 2;
var CALL_DB_EXECUTE = 3;
function postError(callNumber, err) {
    var postArg = {
        callNumber: callNumber,
        result: null,
        error: err
    };
    //console.log(`WebSQL Worker, Sending ${postArg}`);
    global.postMessage(postArg);
}
function postResult(callNumber, result) {
    var postArg = {
        callNumber: callNumber,
        result: result,
        error: null
    };
    //console.log(`WebSQL Worker, Sending ${postArg}`);
    global.postMessage(postArg);
}
global.onmessage = function (postedArg) {
    var params = postedArg["data"];
    //console.log(`WebSQL Worker, Received : ${JSON.stringify(params)}`);
    var call = params["call"];
    var callNumber = params["callNumber"];
    try {
        switch (call) {
            case CALL_DB_OPEN: // Open DB
                return openDb(callNumber, params["dbName"], params["dbSchema"], params["dbVersion"]);
            case CALL_DB_CLOSE: // Close DB
                if (!db)
                    return;
                db.close();
                db = null;
                return postResult(callNumber, null);
            case CALL_DB_EXECUTE: // Execute SQL
                return executeSql(callNumber, params["sql"], params["bindParams"]);
        }
    }
    catch (e) {
        return postError(callNumber, e.toString());
    }
};
global.onerror = postError;
function openDb(callNumber, dbName, dbSchema, dbVersion) {
    new NsSqlite(dbName)
        .then(function (dbArg) {
        db = dbArg;
        if (!NsSqlite.isSqlite(db))
            return postError(callNumber, "The thing we opened isn't a DB");
        db.resultType(NsSqlite.RESULTSASOBJECT);
        db.version(dbVersion); // MATCHES Browser Adaptor
        if (schemaInstalled)
            return postResult(callNumber, null);
        // TODO, Handle more than one SQL statement
        db.all(dbSchema[0])
            .catch(function (err) { return postError(callNumber, err); })
            .then(function () { return postResult(callNumber, null); });
    })
        .catch(function (err) {
        return postError(callNumber, err);
    });
}
function executeSql(callNumber, sql, bindParams) {
    if (db == null)
        return postError(callNumber, "Database has been closed");
    db.all(sql, bindParams)
        .then(function (result) { return postResult(callNumber, result); })
        .catch(function (err) { return postError(callNumber, err); });
}
//# sourceMappingURL=WebSqlNativeScriptThreadedAdaptorWorker.js.map