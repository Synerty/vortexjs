import {Payload} from "./src/vortex/Payload";
import {PayloadDelegateNs} from "./src/vortex/payload/PayloadDelegateNs";

export {WebSqlNativeScriptFactoryService} from "./src/websql/WebSqlNativeScriptAdaptorService";

export {
    TupleStorageFactoryServiceNs
} from "./src/vortex/storage-factory/TupleStorageFactoryServiceNs";

Payload.setWorkerDelegate(new PayloadDelegateNs());
