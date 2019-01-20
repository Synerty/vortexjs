"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var WebSqlService_1 = require("../../websql/WebSqlService");
var TupleStorageIndexedDbService_1 = require("../storage/TupleStorageIndexedDbService");
var TupleStorageWebSqlService_1 = require("../storage/TupleStorageWebSqlService");
var TupleStorageNullService_1 = require("../storage/TupleStorageNullService");
var TupleStorageFactoryService_1 = require("./TupleStorageFactoryService");
var IndexedDb_1 = require("../storage/IndexedDb");
var TupleActionStorageWebSqlService_1 = require("../action-storage/TupleActionStorageWebSqlService");
// import {TupleActionStorageIndexedDbService} from "../action-storage/TupleActionStorageIndexedDbService";
var TupleStorageFactoryServiceWeb = /** @class */ (function (_super) {
    __extends(TupleStorageFactoryServiceWeb, _super);
    function TupleStorageFactoryServiceWeb(webSqlFactory) {
        return _super.call(this, webSqlFactory) || this;
    }
    TupleStorageFactoryServiceWeb.prototype.create = function (name) {
        // Prefer Web SQL
        if (this.webSqlFactory.supportsWebSql()
            && !this.webSqlFactory.hasStorageLimitations()) {
            console.log("TupleStorageFactoryService: Choosing WebSQL Storage");
            return new TupleStorageWebSqlService_1.TupleStorageWebSqlService(this.webSqlFactory, name);
        }
        // Fallback to Indexed DB, It gives mega space on mobile iOS
        if (IndexedDb_1.supportsIndexedDb()) {
            console.log("TupleStorageFactoryService: Choosing IndexedDB Storage");
            return new TupleStorageIndexedDbService_1.TupleStorageIndexedDbService(name);
        }
        // Otheriwse, the null service just silently does nothing.
        console.log("TupleStorageFactoryService: Choosing Null Storage");
        return new TupleStorageNullService_1.TupleStorageNullService(name);
    };
    TupleStorageFactoryServiceWeb.prototype.createActionStorage = function () {
        console.log("TupleStorageFactoryService: FORCING WebSQL Storage");
        return new TupleActionStorageWebSqlService_1.TupleActionStorageWebSqlService(this.webSqlFactory);
        /*
            // Prefer Web SQL
            if (this.webSqlFactory.supportsWebSql()
                && !this.webSqlFactory.hasStorageLimitations()) {
                console.log("TupleStorageFactoryService: Choosing WebSQL Storage");
                return new TupleActionStorageWebSqlService(this.webSqlFactory);
            }

            // Fallback to Indexed DB, It gives mega space on mobile iOS
            if (supportsIndexedDb()) {
                console.log("TupleStorageFactoryService: Choosing IndexedDB Storage");
                return new TupleActionStorageIndexedDbService();
            }

            // Otheriwse, raise an exception.
            console.log("TupleStorageFactoryService: Choosing Null Storage");
            throw new Error("Failed to choose a suitable storage backend for" +
                " offline TupleActions");

            // Maybe we could have an in memory tuple action cache, but it wouldn't be the
            // same.
            */
    };
    TupleStorageFactoryServiceWeb = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [WebSqlService_1.WebSqlFactoryService])
    ], TupleStorageFactoryServiceWeb);
    return TupleStorageFactoryServiceWeb;
}(TupleStorageFactoryService_1.TupleStorageFactoryService));
exports.TupleStorageFactoryServiceWeb = TupleStorageFactoryServiceWeb;
//# sourceMappingURL=/Users/jchesney/dev-peek-util/vortexjs/src/vortex/storage-factory/TupleStorageFactoryServiceWeb.js.map