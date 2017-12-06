"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Payload_1 = require("./src/vortex/Payload");
var PayloadDelegateNs_1 = require("./src/vortex/payload/PayloadDelegateNs");
var WebSqlNativeScriptAdaptorService_1 = require("./src/websql/WebSqlNativeScriptAdaptorService");
exports.WebSqlNativeScriptFactoryService = WebSqlNativeScriptAdaptorService_1.WebSqlNativeScriptFactoryService;
var TupleStorageFactoryServiceNs_1 = require("./src/vortex/storage-factory/TupleStorageFactoryServiceNs");
exports.TupleStorageFactoryServiceNs = TupleStorageFactoryServiceNs_1.TupleStorageFactoryServiceNs;
Payload_1.Payload.setWorkerDelegate(new PayloadDelegateNs_1.PayloadDelegateNs());
//# sourceMappingURL=/Users/jchesney/project/vortexjs/index-nativescript.js.map