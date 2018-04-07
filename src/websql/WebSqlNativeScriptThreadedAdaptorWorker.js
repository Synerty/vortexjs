var NsSqlite = require("nativescript-sqlite/sqlite");
var db = null;
var schemaInstalled = false;
function postError(call, callNumber, err) {
    var postArg = {
        call: call,
        callNumber: callNumber,
        result: null,
        error: err
    };
    //console.log(`WebSQL Worker, Sending ${postArg}`);
    global.postMessage(postArg);
}
function postResult(call, callNumber, result) {
    var postArg = {
        call: call,
        callNumber: callNumber,
        result: result,
        error: null
    };
    //console.log(`WebSQL Worker, Sending ${postArg}`);
    global.postMessage(postArg);
}
var CALL_DB_OPEN = 1;
// const CALL_DB_CLOSE = 2;
var CALL_DB_EXECUTE = 3;
global.onmessage = function (postedArg) {
    var params = postedArg["data"];
    //console.log(`WebSQL Worker, Received : ${JSON.stringify(params)}`);
    var call = params["call"];
    var callNumber = params["callNumber"];
    try {
        switch (call) {
            case CALL_DB_OPEN:// Open DB
                openDb(params["dbName"], params["dbSchema"], params["dbVersion"]);
                break;
            case CALL_DB_EXECUTE:// Open DB
                executeSql(callNumber, params["sql"], params["bindParams"]);
                break;
        }
    }
    catch (e) {
        postError(call, null, e.toString());
    }
};
global.onerror = postError;
function openDb(dbName, dbSchema, dbVersion) {
    new NsSqlite(dbName)
        .then(function (dbArg) {
        db = dbArg;
        if (!NsSqlite.isSqlite(db)) {
            postError(CALL_DB_OPEN, null, "The thing we opened isn't a DB");
            return;
        }
        db.resultType(NsSqlite.RESULTSASOBJECT);
        db.version(dbVersion); // MATCHES Browser Adaptor
        if (schemaInstalled) {
            postResult(CALL_DB_OPEN, null, null);
            return;
        }
        db.all(dbSchema)
            .catch(function (err) {
            postError(CALL_DB_OPEN, null, err);
        })
            .then(function () {
            postResult(CALL_DB_OPEN, null, null);
        });
    })
        .catch(function (err) {
        postError(CALL_DB_OPEN, null, err);
    });
}
function executeSql(callNumber, sql, bindParams) {
    db.all(sql, bindParams)
        .then(function (result) { return postResult(CALL_DB_EXECUTE, callNumber, result); })
        .catch(function (err) { return postError(CALL_DB_EXECUTE, callNumber, err); });
}
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/websql/WebSqlNativeScriptThreadedAdaptorWorker.js.map