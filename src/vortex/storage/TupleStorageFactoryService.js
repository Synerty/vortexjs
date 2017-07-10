"use strict";
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
var TupleIndexedDbService_1 = require("./TupleIndexedDbService");
var TupleStorageWebSqlService_1 = require("./TupleStorageWebSqlService");
var TupleStorageNullService_1 = require("./TupleStorageNullService");
var TupleStorageFactoryService = (function () {
    function TupleStorageFactoryService(webSqlFactory) {
        this.webSqlFactory = webSqlFactory;
    }
    TupleStorageFactoryService.prototype.create = function (name) {
        // Prefer Web SQL
        if (this.webSqlFactory.supportsWebSql()
            && !this.webSqlFactory.hasStorageLimitations()) {
            console.log("TupleStorageFactoryService: Choosing WebSQL Storage");
            return new TupleStorageWebSqlService_1.TupleStorageWebSqlService(this.webSqlFactory, name);
        }
        // Fallback to Indexed DB, It gives mega space on mobile iOS
        if (TupleIndexedDbService_1.supportsIndexedDb()) {
            console.log("TupleStorageFactoryService: Choosing IndexedDB Storage");
            return new TupleIndexedDbService_1.TupleIndexedDbService(name);
        }
        // Otheriwse, the null service just silently does nothing.
        console.log("TupleStorageFactoryService: Choosing Null Storage");
        return new TupleStorageNullService_1.TupleStorageNullService(name);
    };
    return TupleStorageFactoryService;
}());
TupleStorageFactoryService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [WebSqlService_1.WebSqlFactoryService])
], TupleStorageFactoryService);
exports.TupleStorageFactoryService = TupleStorageFactoryService;
//# sourceMappingURL=/home/peek/project/vortexjs/src/vortex/storage/TupleStorageFactoryService.js.map