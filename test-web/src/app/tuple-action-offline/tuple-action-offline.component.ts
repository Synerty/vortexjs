import {Component, OnInit} from "@angular/core";
import {TupleUpdateAction, TupleGenericAction} from "../../vortex/TupleAction";
import {TupleActionPushOfflineService} from "../../vortex/TupleActionPushOfflineService";
import {VortexStatusService} from "../../vortex/VortexStatusService";
import {PerformTestActionTuple} from "../tuple-action/PerformTestActionTuple";

@Component({
    selector: 'app-tuple-action-offline',
    templateUrl: './tuple-action-offline.component.html',
    styleUrls: ['./tuple-action-offline.component.css']
})
export class TupleActionOfflineComponent implements OnInit {

    log: string = "Not started";
    count: number = -1;
    vortexIsOnline: boolean = false;

    constructor(private tupleActionOfflineService: TupleActionPushOfflineService,
                private vortexStatusService: VortexStatusService) {

        // TODO: Unsubscribe this
        vortexStatusService.queuedActionCount.subscribe(count => this.count = count);
        this.count = vortexStatusService.snapshot.queuedActionCount;

        // TODO: Unsubscribe this
        vortexStatusService.errors .subscribe(errStr => this.log = errStr);

        // TODO: Unsubscribe this
        vortexStatusService.isOnline.subscribe(online => this.vortexIsOnline = online);
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

        this.tupleActionOfflineService.pushAction(tupleAction)
            .then(() => this.log = `SUCCESS : ${new Date()}`)
            .catch(err => this.log = `SUCCESS : ${new Date()}\n${err}`);
    }

    sendFail() {

        let tupleAction = new TupleGenericAction();
        tupleAction.key = PerformTestActionTuple.tupleName;
        tupleAction.data = "FAIL PLEASE";

        this.tupleActionOfflineService.pushAction(tupleAction)
            .then(() => this.log = `SUCCESS : ${new Date()}`)
            .catch(err => this.log = `FAILURE : ${new Date()}\n${err}`);
    }

}
