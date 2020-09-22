import {Component, OnInit} from "@angular/core";
import {TestTuple} from "../tuple/tuple.component";
import {VortexService} from "../../vortex/VortexService";
import {TupleLoader} from "../../vortex/TupleLoader";
import { NgLifeCycleEvents } from "@synerty/peek-plugin-base-js"

@Component({
    selector: 'app-tuple-loader',
    templateUrl: './tuple-loader.component.html',
    styleUrls: ['./tuple-loader.component.css']
})
export class TupleLoaderComponent extends NgLifeCycleEvents {
    tuples: Array<TestTuple>;
    loader: TupleLoader;
    tupleId: number = 1;

    constructor(private vortexService: VortexService) {
        super();

        this.tuples = [];

        this.loader = vortexService.createTupleLoader(this,
            () => {
                return {
                    id: this.tupleId,
                    key: "vortex.tuple-loader.test.data"
                };
            }
        );

        this.loader.observable.subscribe(tuples => this.tuples = <Array<TestTuple>> tuples);

    }

    addNew() {
        let newTuple = new TestTuple();
        newTuple.aString = `New Tuple #${this.tuples.length}`;
        this.tuples.push(newTuple);
    }
}
