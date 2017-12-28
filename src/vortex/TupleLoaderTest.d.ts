import { ComponentLifecycleEventEmitter } from "./ComponentLifecycleEventEmitter";
import { VortexService } from "./VortexService";
export declare class Ang2TupleLoaderTest extends ComponentLifecycleEventEmitter {
    private vortexService;
    tuples: any[];
    id: number | null;
    private loader;
    constructor(vortexService: VortexService);
}
