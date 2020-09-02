import { Inject, Injectable } from "@angular/core"
import { VortexStatusService } from "../VortexStatusService"
import { TupleActionABC } from "../TupleAction"
import { Tuple } from "../exports"
import { TupleActionPushNameService, TupleActionPushService } from "./TupleActionPushService"
import { VortexService } from "../VortexService"
import { TupleActionPushOfflineSingletonService } from "./TupleActionPushOfflineSingletonService"

@Injectable()
export class TupleActionPushOfflineService extends TupleActionPushService {
    constructor(
        @Inject(TupleActionPushNameService) public tupleActionName,
        @Inject(VortexService) public vortexService,
        @Inject(VortexStatusService) public vortexStatus,
        @Inject(TupleActionPushOfflineSingletonService) public singleton,
    ) {
        super(tupleActionName, vortexService, vortexStatus)
    }
    
    pushAction(tupleAction: TupleActionABC): Promise<Tuple[]> {
        let payload = this.makePayload(tupleAction)
        return this.singleton
            .queueAction(this.tupleActionProcessorName.name, tupleAction, payload)
            .then(() => [])
    }
}

