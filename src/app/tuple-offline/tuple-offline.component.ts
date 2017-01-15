import {Component, OnInit} from "@angular/core";
import {TupleOfflineStorageService} from "../../vortex/TupleOfflineStorageService";
import {Tuple} from "../../vortex/Tuple";
import {TupleSelector} from "../../vortex/TupleSelector";

export class OfflineTestTuple extends Tuple {
    testVal1: string = "";

    constructor() {
        super("vortex.test.OfflineTestTuple");

    }
}

@Component({
    selector: 'app-tuple-offline',
    templateUrl: './tuple-offline.component.html',
    styleUrls: ['./tuple-offline.component.css']
})
export class TupleOfflineComponent implements OnInit {
    status: string = "";
    sampleTupleData: OfflineTestTuple[] = [];
    loadedTupleData: OfflineTestTuple[] = [];
    selectorMatch: TupleSelector;

    constructor(public tupleOfflineStorageService: TupleOfflineStorageService) {
        this.selectorMatch = new TupleSelector("some name", {});

        for (let i = 0; i < 5; i++) {
            let t = new OfflineTestTuple();
            t.testVal1 = `#${i} Created ${new Date().toISOString()}`;
            this.sampleTupleData.push(t);
        }
    }

    ngOnInit() {
    }

    loadTest() {
        return this.tupleOfflineStorageService
            .loadTuples(this.selectorMatch)
            .catch(err => this.status = `ERR: loadTest: ${err}`)
            .then((tuples: OfflineTestTuple[]) => {
                this.status = "Promise loadTest success";
                this.loadedTupleData = tuples;
            });
    }

    saveTest() {
        return this.tupleOfflineStorageService
            .saveTuples(this.selectorMatch, this.sampleTupleData)
            .catch(err => this.status = `ERR: saveTest: ${err}`)
            .then(() => {
                this.status = "Promise saveTest success";
            });
    }
}
