import { OnInit } from "@angular/core";
import { Payload } from "../../vortex/Payload";
import { VortexService } from "../../vortex/VortexService";
export declare class PayloadComponent implements OnInit {
    vortexService: VortexService;
    constructor(vortexService: VortexService);
    ngOnInit(): void;
    testMakePayload(): Payload;
    testPayloadEcho2Hop(): boolean;
    testPayloadToFromVortexMsg(): boolean;
}
