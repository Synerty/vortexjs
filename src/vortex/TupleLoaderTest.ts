import Ng2TupleLoader from "./TupleLoader";
import {Ng2CompLifecycleEvent} from "./Ng2CompLifecycleEvent";



export class Ang2TupleLoaderTest extends Ng2CompLifecycleEvent {
    private vortexData: Ng2TupleLoader;

    constructor() {
        super();
        let self = this;

        self.vortexData = new Ng2TupleLoader(self, {key: "val"}, {
            objName: "data",
            loadOnInit: false,
            loadOnIdChange: false,
            dataIsArray: false
        });


    }
}