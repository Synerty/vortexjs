import {Component, OnInit} from "@angular/core";
import {Payload} from "../../vortex/Payload";
import {TupleComponent} from "../tuple/tuple.component";
import {VortexService} from "../../vortex/VortexService";
import {assert} from "../../vortex/UtilMisc";

@Component({
    selector: 'app-payload',
    templateUrl: './payload.component.html',
    styleUrls: ['./payload.component.css']
})
export class PayloadComponent implements OnInit {

    constructor(public vortexService: VortexService) {
    }

    ngOnInit() {
    }

    testMakePayload() {
        let payload = new Payload();
        payload.tuples = [TupleComponent.testMakeTuple()];

        return payload;
    }

    testPayloadEcho2Hop() {
        let payload = this.testMakePayload();
        payload.filt['key'] = 'rapuiServerEcho';
        this.vortexService.sendPayload(payload);
        console.log("testPayloadEcho2Hop");
        return true;
    }

    testPayloadToFromVortexMsg() {
        let origPayload = this.testMakePayload();
        let origVortexMsg = origPayload.toVortexMsg();
        let payload = Payload.fromVortexMsg(origVortexMsg);
        let vortexMsg = payload.toVortexMsg();

        console.log(vortexMsg);
        console.log(origVortexMsg);

        assert(origPayload.equals(payload),
            "testPayloadToFromVortexMsg, Payload objects do not match");
        assert(origVortexMsg == vortexMsg,
            "testPayloadToFromVortexMsg, Payload vortex msg strings do not match");

        return true;
    }

}
