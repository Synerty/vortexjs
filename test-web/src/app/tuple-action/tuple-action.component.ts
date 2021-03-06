import {Component, OnInit} from "@angular/core";
import {TupleActionPushService} from "../../vortex/TupleActionPushService";
import {TupleUpdateAction, TupleGenericAction} from "../../vortex/TupleAction";
import {PerformTestActionTuple} from "./PerformTestActionTuple";

@Component({
    selector: 'app-tuple-action',
    templateUrl: './tuple-action.component.html',
    styleUrls: ['./tuple-action.component.css']
})
export class TupleActionComponent implements OnInit {

    log: string = "Not started";

    constructor(private tupleActionService: TupleActionPushService) {
    }

    ngOnInit() {
    }

    sendSuccess() {
        let testTuple = new PerformTestActionTuple();
        testTuple.actionDataInt = 111;
        testTuple._setChangeTracking();

        testTuple.actionDataInt = 112;
        testTuple.actionDataUnicode = "something";


        let tupleAction = new TupleUpdateAction();
        tupleAction.tupleSelector.name = testTuple._tupleName();
        tupleAction.tupleChanges = testTuple._detectedChanges();

        this.tupleActionService.pushAction(tupleAction)
            .then(() => this.log = `SUCCESS : ${new Date()}`)
            .catch(err => this.log = `SUCCESS : ${new Date()}\n${err}`);
    }

    sendFail() {

        let tupleAction = new TupleGenericAction();
        tupleAction.key = PerformTestActionTuple.tupleName;
        tupleAction.data = "FAIL PLEASE";

        this.tupleActionService.pushAction(tupleAction)
            .then(() => this.log = `SUCCESS : ${new Date()}`)
            .catch(err => this.log = `FAILURE : ${new Date()}\n${err}`);
    }

}
