import {Component, OnInit} from "@angular/core";
import {TupleDataObserver} from "../../vortex/TupleDataObserver";
import {Tuple} from "../../vortex/Tuple";
import {TupleSelector} from "../../vortex/TupleSelector";

@Component({
    selector: 'app-tuple-observer',
    templateUrl: './tuple-observer.component.html',
    styleUrls: ['./tuple-observer.component.css']
})
export class TupleObserverComponent implements OnInit {

    testTuples1: Tuple[] = [];
    testTuples2: Tuple[] = [];

    constructor(private tupleDataObserver: TupleDataObserver) {
        tupleDataObserver.subscribeToTupleSelector(
            new TupleSelector("testTuples1",
                {"count": 4})
        ).subscribe(tuples => this.testTuples1 = tuples);

        tupleDataObserver.subscribeToTupleSelector(
            new TupleSelector("testTuples2",
                {"count": 7})
        ).subscribe(tuples => this.testTuples2 = tuples);

    }

    ngOnInit() {
    }

}
