import { TupleActionProcessorDelegateABC } from "./TupleActionProcessorDelegate";
import { VortexService } from "./VortexService";
import { ComponentLifecycleEventEmitter } from "./ComponentLifecycleEventEmitter";
import { VortexStatusService } from "./VortexStatusService";
export declare class TupleActionProcessorNameService {
    name: string;
    additionalFilt: {};
    constructor(name: string, additionalFilt?: {});
}
export declare class TupleActionProcessorService extends ComponentLifecycleEventEmitter {
    private tupleActionProcessorName;
    private vortexService;
    private vortexStatusService;
    private _tupleProcessorsByTupleName;
    private defaultDelegate;
    constructor(tupleActionProcessorName: TupleActionProcessorNameService, vortexService: VortexService, vortexStatusService: VortexStatusService);
    /** Add Tuple Action Processor Delegate
     *
     *@param tupleName: The tuple name to process actions for.
     *@param processor: The processor to use for processing this tuple name.
     *
     */
    setDelegate(tupleName: string, delegate: TupleActionProcessorDelegateABC): void;
    /** Set Default Tuple Action Processor Delegate
     *
     *@param processor: The processor to use for processing unhandled TupleActions.
     *
     */
    setDefaultDelegate(delegate: TupleActionProcessorDelegateABC): void;
    /** Process the Payload / Tuple Action
     *
     */
    private _process(payload);
    private callback(tuples, replyFilt, tupleName);
    private errback(err, replyFilt, tupleName);
}
