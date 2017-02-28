import { VortexStatusService } from "../vortex/VortexStatusService";
export declare class AppComponent {
    private vortexStatusService;
    title: string;
    vortexIsOnline: boolean;
    constructor(vortexStatusService: VortexStatusService);
}
