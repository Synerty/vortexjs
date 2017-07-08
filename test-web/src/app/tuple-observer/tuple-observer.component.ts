import {Component, OnInit} from "@angular/core";
import {TupleDataObserverService} from "../../vortex/TupleDataObserverService";
import {Tuple} from "../../vortex/Tuple";
import {TupleSelector} from "../../vortex/TupleSelector";


export let testTupleSelector1 = new TupleSelector("testTuples1", {"count": 4});
export let testTupleSelector2 = new TupleSelector("testTuples2", {"count": 7});

@Component({
    selector: 'app-tuple-observer',
    templateUrl: './tuple-observer.component.html',
    styleUrls: ['./tuple-observer.component.css']
})
export class TupleObserverComponent implements OnInit {

    testTuples1: Tuple[] = [];
    testTuples2: Tuple[] = [];

    constructor(private tupleDataObserver: TupleDataObserverService) {
        tupleDataObserver.subscribeToTupleSelector(testTupleSelector1)
            .subscribe(tuples => this.testTuples1 = tuples);

        tupleDataObserver.subscribeToTupleSelector(testTupleSelector2)
            .subscribe(tuples => this.testTuples2 = tuples);

    }

    ngOnInit() {
    }

}
