import {Payload} from "../Payload";
import {TupleActionProcessorDelegateABC} from "./TupleActionProcessorDelegate";
import {assert, extend} from "../UtilMisc";
import {VortexService} from "../VortexService";
import {ComponentLifecycleEventEmitter} from "../ComponentLifecycleEventEmitter";
import {VortexStatusService} from "../VortexStatusService";
import {Injectable} from "@angular/core";


@Injectable()
export class TupleActionProcessorNameService {
    constructor(public name: string, public additionalFilt = {}) {

    }
}

@Injectable()
export class TupleActionProcessorService extends ComponentLifecycleEventEmitter {
    private _tupleProcessorsByTupleName = {};
    private defaultDelegate :null | TupleActionProcessorDelegateABC = null;


    constructor(private tupleActionProcessorName: TupleActionProcessorNameService,
                private vortexService: VortexService,
                private vortexStatusService: VortexStatusService) {
        super();
        let filt = extend({
            name: tupleActionProcessorName.name,
            key: "tupleActionProcessorName"
        }, tupleActionProcessorName.additionalFilt);

        vortexService.createEndpointObservable(this, filt)
            .subscribe(payload => this._process(payload));

    }

    /** Add Tuple Action Processor Delegate
     *
     *@param tupleName: The tuple name to process actions for.
     *@param processor: The processor to use for processing this tuple name.
     *
     */
    setDelegate(tupleName: string, delegate: TupleActionProcessorDelegateABC) {

        assert(tupleName in this._tupleProcessorsByTupleName,
            `TupleActionProcessor:${this.tupleActionProcessorName.name}, `
            + `Tuple name ${tupleName} is already registered`);

        this._tupleProcessorsByTupleName[tupleName] = delegate;
    }

    /** Set Default Tuple Action Processor Delegate
     *
     *@param processor: The processor to use for processing unhandled TupleActions.
     *
     */
    setDefaultDelegate(delegate: TupleActionProcessorDelegateABC) {
        this.defaultDelegate = delegate;
    }


    /** Process the Payload / Tuple Action
     *
     */
    private _process(payload: Payload) {

        assert(payload.tuples.length === 1,
            `TupleActionProcessor:${this.tupleActionProcessorName.name}`
            + `Expected 1 tuples, received ${payload.tuples.length}`);

        let tupleAction = payload.tuples[0];

        let tupleName = tupleAction._tupleName();

        let delegate = null;
        let processor = this._tupleProcessorsByTupleName[tupleName];
        if (processor != null) {
            delegate = processor;

        } else if (this.defaultDelegate != null) {
            delegate = this.defaultDelegate;
        } else {
            console.log(`ERROR No delegate registered for ${tupleName}`);
            return;
            // throw new Error(`No delegate registered for ${tupleName}`);
        }

        let promise = delegate.processTupleAction(tupleAction);
        promise.then(tuples => this.callback(tuples, payload.filt, tupleName));
        promise.catch(err => this.errback(err, payload.filt, tupleName));
    }


    private callback(tuples, replyFilt: {}, tupleName: string) {
        let payload = new Payload(replyFilt, tuples);

        this.vortexService.sendPayload(payload);
    }


    private errback(err: string, replyFilt: {}, tupleName: string) {

        this.vortexStatusService.logError(
            `TupleActionProcessor:${this.tupleActionProcessorName.name}` +
            ` Failed to process TupleActon, ${err}`);

        let payload = new Payload(replyFilt);
        payload.result = err;

        this.vortexService.sendPayload(payload);
    }

}
