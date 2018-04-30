import {Injectable} from "@angular/core";
import {VortexStatusService} from "../VortexStatusService";
import {TupleActionABC} from "../TupleAction";
import {Payload} from "../Payload";
import {VortexService} from "../VortexService";
import {errToStr} from "../UtilMisc";
import {PayloadResponse} from "../PayloadResponse";
import {TupleStorageFactoryService} from "../storage-factory/TupleStorageFactoryService";
import {TupleActionStorageServiceABC} from "../action-storage/TupleActionStorageServiceABC";
import {PayloadEnvelope} from "../PayloadEnvelope";


@Injectable()
export class TupleActionPushOfflineSingletonService {
    private storage: TupleActionStorageServiceABC;
    private sendingTuple = false;
    private lastSendFailTime: null | number = null;

    private SEND_FAIL_RETRY_TIMEOUT = 5000;// milliseconds
    private SERVER_PROCESSING_TIMEOUT = 5000;// milliseconds
    private SEND_FAIL_RETRY_BACKOFF = 5000; // milliseconds

    constructor(private vortexService: VortexService,
                private vortexStatus: VortexStatusService,
                factoryService: TupleStorageFactoryService) {

        this.storage = factoryService.createActionStorage();

        // This is a global service, there is no point unsubscribing it
        this.vortexStatus.isOnline
            .filter(online => online === true)
            .subscribe(online => this.sendNextAction());

        this.storage.countActions()
            .then(count => {
                this.vortexStatus.setQueuedActionCount(count);
            })
            .catch(err => {
                let errStr = errToStr(err);
                let msg = `Failed to count actions : ${errStr}`;
                this.vortexStatus.logError(msg);
            })
            .then(() => this.sendNextAction());
    }


    queueAction(scope: string, tupleAction: TupleActionABC, payload: Payload): Promise<void> {
        return this.storage.storeAction(scope, tupleAction, payload)
            .then(() => {
                this.vortexStatus.incrementQueuedActionCount();
                this.sendNextAction();
            })
            .catch((err) => {
                let errStr = errToStr(err);
                let msg = `Failed to store action : ${errStr}`;
                console.log(msg);
                throw new Error(msg);
            });
    }

    private sendNextAction() {
        if (this.sendingTuple)
            return;

        if (!this.vortexStatus.snapshot.isOnline)
            return;

        // Don't continually retry, if we have a last send fail, ensure we wait
        // {SEND_FAIL_RETRY_BACKOFF} before sending again.
        if (this.lastSendFailTime != null) {
            let reconnectDiffMs = Date.now() - this.lastSendFailTime;

            if (reconnectDiffMs < this.SEND_FAIL_RETRY_BACKOFF) {
                // +10ms to ensure we're just out of the backoff time.
                setTimeout(() => this.sendNextAction(),
                    this.SEND_FAIL_RETRY_BACKOFF - reconnectDiffMs + 10);
                return;

            } else {
                this.lastSendFailTime = null;

            }
        }

        this.sendingTuple = true;

        // Get the next tuple from the persistent queue
        this.storage.loadNextAction()

        // If this was successful?
            .then((sendPayload: Payload) => {
                // Is the end the end of the queue?
                if (sendPayload == null) {
                    this.sendingTuple = false;
                    return;
                }
                return sendPayload.makePayloadEnvelope()
                    .then((sendPayloadEnvelope:PayloadEnvelope) => {

                        let uuid = (<TupleActionABC> sendPayload.tuples[0]).uuid;
                        let scope = sendPayload.filt["name"];

                        return new PayloadResponse(this.vortexService,
                            sendPayloadEnvelope,
                            PayloadResponse.RESPONSE_TIMEOUT_SECONDS, // Timeout
                            false // don't check result, only reject if it times out
                        ).then(responsePayload => {
                            // If we received a payload, but it has an error message
                            // Log an error, it's out of our hands, move on.
                            let r = responsePayload.result; // success is null or true
                            if (!(r == null || r === true)) {
                                this.vortexStatus.logError(
                                    'Server failed to process Action: ' + responsePayload.result.toString());
                            }

                            this.storage.deleteAction(scope, uuid).then(() => {
                                this.vortexStatus.decrementQueuedActionCount();
                            });
                            this.sendingTuple = false;
                            this.sendNextAction();
                        })
                    });

            })

            // Or catch and handle any of the errors from either loading or sending
            .catch(err => {
                this.lastSendFailTime = Date.now();

                let errStr = errToStr(err);
                this.vortexStatus.logError(
                    `Failed to send TupleAction : ${errStr}`
                );
                this.sendingTuple = false;
                setTimeout(() => this.sendNextAction(), this.SEND_FAIL_RETRY_TIMEOUT);
                return null; // Handle the error
            });
    }

}

