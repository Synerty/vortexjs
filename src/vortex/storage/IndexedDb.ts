import {Injectable} from "@angular/core";
import {dateStr} from "../UtilMisc";
import {TupleStorageServiceABC, TupleStorageTransaction} from "./TupleStorageServiceABC";
import {TupleOfflineStorageNameService} from "../TupleOfflineStorageNameService";
import {TupleSelector} from "../TupleSelector";
import {Tuple} from "../Tuple";
import {Payload} from "../Payload";

// ----------------------------------------------------------------------------

declare let window: any;

export let indexedDB: any = window.indexedDB || window.mozIndexedDB
    || window.webkitIndexedDB || window.msIndexedDB;

export let IDBTransaction: any = window.IDBTransaction
    || window.webkitIDBTransaction || window.msIDBTransaction;

export let IDBKeyRange: any = window.IDBKeyRange
    || window.webkitIDBKeyRange || window.msIDBKeyRange;


export function supportsIndexedDb(): boolean {
    return !!indexedDB;
}

// ----------------------------------------------------------------------------


export class IDBException {
    constructor(public message: string) {
    }

    toString() {
        return 'IndexedDB : IDBException: ' + this.message;
    }
}

export function addIndexedDbHandlers(request, stacktraceFunctor) {
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
