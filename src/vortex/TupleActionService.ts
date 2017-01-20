import {Injectable} from "@angular/core";
import {VortexStatusService} from "./VortexStatusService";
import {TupleAction} from "./TupleAction";
import {VortexService} from "./VortexService";
import {PayloadResponse} from "./PayloadResponse";
import {Payload} from "./Payload";
import {extend} from "./UtilMisc";


@Injectable()
export class TupleActionNameService {
    constructor(public name: string, public additionalFilt = {}) {

    }
}


@Injectable()
export class TupleActionService {

    constructor(protected tupleActionName: TupleActionNameService,
                protected vortexService: VortexService,
                protected vortexStatus: VortexStatusService) {
    }

    /** Push Action
     *
     * This pushes the action, either locally or to the server, depending on the
     * implementation.
     *
     * If pushed locally, the promise will resolve when the action has been saved.
     * If pushed directly to the server, the promise will resolve when the server has
     * responded.
     */
    pushAction(tupleAction: TupleAction): Promise<TupleAction> {
        return this.sendAction(tupleAction);
    }

    /** Send Action
     *
     * Sends the action to the server, returns a promise with
     */
    protected sendAction(tupleAction: TupleAction): Promise<TupleAction> {
        if (!this.vortexStatus.snapshot.isOnline)
            return Promise.reject("Vortex is offline");

        let payloadResponse = new PayloadResponse(
            this.vortexService, this.makePayload(tupleAction));

        return payloadResponse
            .then(payload => payload.tuples[0]);

    }

    /** Make Payload
     *
     * This make the payload that we send to the server.
     *
     */
    protected makePayload(tupleAction: TupleAction): Payload {

        let payload = new Payload();

        payload.filt = extend({
            key: "tupleActionHandler",
            actionServiceName: this.tupleActionName.name
        }, this.tupleActionName.additionalFilt);

        payload.tuples = [tupleAction];

        return payload;
    }

}
