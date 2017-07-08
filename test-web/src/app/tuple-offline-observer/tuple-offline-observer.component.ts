import {Component, OnInit} from "@angular/core";
import {TupleDataOfflineObserverService} from "../../vortex/TupleDataOfflineObserverService";
import {Tuple} from "../../vortex/Tuple";
import {
    testTupleSelector2,
    testTupleSelector1
} from "../tuple-observer/tuple-observer.component";

@Component({
    selector: 'app-tuple-offline-observer',
    templateUrl: './tuple-offline-observer.component.html',
    styleUrls: ['./tuple-offline-observer.component.css']
})
export class TupleOfflineObserverComponent implements OnInit {

    testTuples1: Tuple[] = [];
    testTuples2: Tuple[] = [];

    constructor(private tupleDataOfflineObserver: TupleDataOfflineObserverService) {
        tupleDataOfflineObserver.subscribeToTupleSelector(testTupleSelector1)
            .subscribe(tuples => this.testTuples1 = tuples);

        tupleDataOfflineObserver.subscribeToTupleSelector(testTupleSelector2)
            .subscribe(tuples => this.testTuples2 = tuples);

    }

    ngOnInit() {
    }

}
