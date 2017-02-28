import { OnInit } from "@angular/core";
import { Payload } from "../../vortex/Payload";
import { ComponentLifecycleEventEmitter } from "../../vortex/ComponentLifecycleEventEmitter";
export declare class PayloadEndpointComponent extends ComponentLifecycleEventEmitter implements OnInit {
    _deliveredPayload: any;
    _payloadEndpoint: any;
    _payload: any;
    constructor();
    ngOnInit(): void;
    _testBuild(plFilt: any, epFilt: any): Payload;
    testFiltMatches(): boolean;
    testShutdown(): boolean;
    testFiltValueUnmatched(): boolean;
    testFiltKeyUnmatched(): boolean;
}
