import {Injectable} from "@angular/core";
import {VortexStatusService} from "./VortexStatusService";
import {TupleActionABC} from "./TupleAction";
import {Tuple} from "./Tuple";
import {
    TupleActionPushNameService,
    TupleActionPushService
} from "./TupleActionPushService";
import {VortexService} from "./VortexService";
import {TupleActionPushOfflineSingletonService} from "./TupleActionPushOfflineSingletonService";

@Injectable()
export class TupleActionPushOfflineService extends TupleActionPushService {

    constructor(tupleActionName: TupleActionPushNameService,
                vortexService: VortexService,
                vortexStatus: VortexStatusService,
                private singleton: TupleActionPushOfflineSingletonService) {
        super(tupleActionName, vortexService, vortexStatus);

    }


    pushAction(tupleAction: TupleActionABC): Promise<Tuple[]> {
        let payload = this.makePayload(tupleAction);
        return this.singleton
            .queueAction(this.tupleActionProcessorName.name, tupleAction, payload)
            .then(() => []);
    }

}

