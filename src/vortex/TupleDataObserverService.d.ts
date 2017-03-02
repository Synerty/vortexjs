import { Subject } from "rxjs";
import { VortexService } from "./VortexService";
import { Tuple } from "./Tuple";
import { TupleSelector } from "./TupleSelector";
import { IPayloadFilt } from "./Payload";
import { PayloadEndpoint } from "./PayloadEndpoint";
import { ComponentLifecycleEventEmitter } from "./ComponentLifecycleEventEmitter";
import { VortexStatusService } from "./VortexStatusService";
export declare class TupleDataObservableNameService {
    name: string;
    additionalFilt: {};
    constructor(name: string, additionalFilt?: {});
}
export declare class TupleDataObserverService extends ComponentLifecycleEventEmitter {
    protected vortexService: VortexService;
    protected statusService: VortexStatusService;
    protected endpoint: PayloadEndpoint;
    protected filt: IPayloadFilt;
    protected subjectsByTupleSelector: {
        [tupleSelector: string]: Subject<Tuple[]>;
    };
    constructor(vortexService: VortexService, statusService: VortexStatusService, tupleDataObservableName: TupleDataObservableNameService);
    pollForTuples(tupleSelector: TupleSelector): Promise<Tuple[]>;
    subscribeToTupleSelector(tupleSelector: TupleSelector): Subject<Tuple[]>;
    protected vortexOnlineChanged(): void;
    protected receivePayload(payload: any): void;
    protected notifyObservers(subject: Subject<Tuple[]>, tupleSelector: TupleSelector, tuples: Tuple[]): void;
    protected tellServerWeWantData(tupleSelectors: TupleSelector[]): void;
}
