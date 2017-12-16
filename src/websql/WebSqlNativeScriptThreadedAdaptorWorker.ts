let NsSqlite = require("nativescript-sqlite");

declare let global: any;

let db: any = null;
let schemaInstalled: any = false;

function postError(call: number, callNumber: number, err): void {
  let postArg = {
    call: call,
    callNumber: callNumber,
    result: null,
    error: err
  };
  //console.log(`WebSQL Worker, Sending ${postArg}`);
  global.postMessage(postArg);
}

function postResult(call: number, callNumber: number, result): void {
  let postArg = {
    call: call,
    callNumber: callNumber,
    result: result,
    error: null
  };
  //console.log(`WebSQL Worker, Sending ${postArg}`);
  global.postMessage(postArg);
}

const CALL_DB_OPEN = 1;
// const CALL_DB_CLOSE = 2;
const CALL_DB_EXECUTE = 3;


global.onmessage = function (postedArg) {
  let params: any = postedArg["data"];
  //console.log(`WebSQL Worker, Received : ${JSON.stringify(params)}`);
  let call: number = params["call"]
  let callNumber: number = params["callNumber"]

  try {
    switch (call) {
      case CALL_DB_OPEN: // Open DB
        openDb(params["dbName"], params["dbSchema"], params["dbVersion"]);
        break;
      case CALL_DB_EXECUTE: // Open DB
        executeSql(callNumber, params["sql"], params["bindParams"]);
        break;
    }
  } catch (e) {
    postError(call, null, e.toString());
  }


};


global.onerror = postError;

function openDb(dbName: string, dbSchema: string, dbVersion: string): void {
  new NsSqlite(dbName)
    .then((dbArg) => {
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
        .catch((err) => {
          postError(CALL_DB_OPEN, null, err);
        })
        .then(() => {
          postResult(CALL_DB_OPEN, null, null);
        });
    })
    .catch((err) => {
      postError(CALL_DB_OPEN, null, err);
    });
}


function executeSql(callNumber: number, sql: string, bindParams: any): void {
  db.all(sql, bindParams)
    .then(result => postResult(CALL_DB_EXECUTE, callNumber, result))
    .catch(err => postError(CALL_DB_EXECUTE, callNumber, err));
}  