import { OnInit } from "@angular/core";
import { TestTuple } from "../tuple/tuple.component";
import { VortexService } from "../../vortex/VortexService";
import { TupleLoader } from "../../vortex/TupleLoader";
import { ComponentLifecycleEventEmitter } from "../../vortex/ComponentLifecycleEventEmitter";
export declare class TupleLoaderComponent extends ComponentLifecycleEventEmitter implements OnInit {
    private vortexService;
    tuples: Array<TestTuple>;
    loader: TupleLoader;
    tupleId: number;
    constructor(vortexService: VortexService);
    ngOnInit(): void;
    addNew(): void;
}
