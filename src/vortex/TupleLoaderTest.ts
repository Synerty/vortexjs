import { TupleLoader } from "./TupleLoader"
import { NgLifeCycleEvents } from "../util/NgLifeCycleEvents"
import { VortexService } from "./VortexService"

export class Ang2TupleLoaderTest extends NgLifeCycleEvents {
    
    tuples: any[] = []
    id: number | null = null
    
    private loader: TupleLoader
    
    constructor(private vortexService: VortexService) {
        super()
        
        this.loader = vortexService.createTupleLoader(this,
            () => {
                return {
                    key: "plugin_noop.tuple_loader.items",
                    id: this.id
                }
            })
        
        this.loader.observable.subscribe(tuples => this.tuples = tuples)
        
    }
}
