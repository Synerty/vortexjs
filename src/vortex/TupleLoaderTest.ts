import {TupleLoader} from "./TupleLoader";
import {ComponentLifecycleEventEmitter} from "./ComponentLifecycleEventEmitter";
import {VortexService} from "./Vortex";


export class Ang2TupleLoaderTest extends ComponentLifecycleEventEmitter {

    tuples: any[] = [];
    id: number|null = null;

    private loader: TupleLoader;

    constructor(private vortexService: VortexService) {
        super();

        this.loader = vortexService.createTupleLoader(this,
            () => {
                return {
                    key: "plugin_noop.tuple_loader.items",
                    id: this.id
                }
            });

        this.loader.observable.subscribe(tuples => this.tuples = tuples);

    }
}