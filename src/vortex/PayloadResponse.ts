import {VortexClientABC} from "./VortexClientABC";
import {IPayloadFilt} from "./Payload";
import {dateStr} from "./UtilMisc";
import {VortexService} from "./VortexService";
import {ComponentLifecycleEventEmitter} from "./ComponentLifecycleEventEmitter";
import {PayloadEnvelope} from "./PayloadEnvelope";

/** Payload Response
 *
 *    This class is used to catch responses from a sent payload.
 *    If the remote end is going to send back a payload, with the same filt,
 *    this class catches this then either resolves or rejects the promise.
 *
 *    If the response is not received within the timeout, the errback is called.
 *
 *    ** The PayloadResponse in VortexJS Sends the Payload **
 *
 *    Here is some example usage.
 *
 *    ::
 *
 *        payload = Payload(filt={"rapuiServerEcho":True})
 *        responsePromise = PayloadResponse(vortexService, payload)
 *          .then((payload) => console.log(`Received payload ${payload}`))
 *          .catch((err) => console.log(err));
 *
 */
export class PayloadResponse {


    public static readonly RESPONSE_TIMEOUT_SECONDS = 30000; // milliseconds
    private static messageIdKey = "PayloadResponse.messageId";

    readonly PROCESSING = "Processing";
    // NO_ENDPOINT = "No Endpoint"
    readonly FAILED = "Failed";
    readonly SEND_FAILED = "Send Failed";
    readonly SUCCESS = "Success";
    readonly TIMED_OUT = "Timed Out";

    private _messageId: string = VortexClientABC.makeUuid();
    private _status: string = this.PROCESSING;

    private _lcEmitter: ComponentLifecycleEventEmitter
        = new ComponentLifecycleEventEmitter();

    private promise: Promise<PayloadEnvelope>;

    /** Constructor
     * @param vortexService:
     * @param payloadEnvelope: The PayloadEnvelope to send.
     * @param timeout: The timeout to wait for a response - in seconds;
     * @param resultCheck: Should the result of the payload response be checked.
     */
    constructor(vortexService: VortexService,
                private payloadEnvelope: PayloadEnvelope,
                private timeout: number = PayloadResponse.RESPONSE_TIMEOUT_SECONDS,
                private resultCheck: boolean = true) {
        this.promise = new Promise<PayloadEnvelope>((resolve, reject) => {

            // Start the timer
            let timer = null;

            // Create the endpoint
            this.payloadEnvelope.filt[PayloadResponse.messageIdKey] = this._messageId;
            let endpoint = vortexService
                .createEndpoint(this._lcEmitter, (<IPayloadFilt>this.payloadEnvelope.filt));

            let finish = (status) => {
                this._status = status;
                this._lcEmitter.onDestroyEvent.emit("OnDestroy");

                if (timer != null) {
                    clearTimeout(timer);
                    timer = null;
                }
            };

            let callFail = (status: string, msgArg = '') => {
                let filtStr = JSON.stringify(this.payloadEnvelope.filt);
                let msg = `${dateStr()} PayloadEndpoing ${status} Failed : ${msgArg}\n${filtStr}`;
                console.log(msg);

                finish(status);
                reject(msgArg);
            };

            // Subscribe
            endpoint.observable
                .takeUntil(this._lcEmitter.onDestroyEvent)
                .subscribe((payloadEnvelope: PayloadEnvelope) => {

                    let r = payloadEnvelope.result; // success is null or true
                    if (this.resultCheck && !(r == null || r === true)) {
                        callFail(this.FAILED, r.toString());
                    } else {
                        finish(this.SUCCESS);
                        resolve(payloadEnvelope);
                    }

                });

            vortexService.sendPayloadEnvelope(this.payloadEnvelope)
                .then(() => {
                    timer = setTimeout(() => callFail(this.TIMED_OUT), timeout);
                })
                .catch((err) => {
                    callFail(this.SEND_FAILED, err);
                });

        });
    }

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then(onfulfilled, onrejected = null): Promise<PayloadEnvelope> {
        return this.promise.then(onfulfilled, onrejected);
    }


    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch(onrejected): Promise<PayloadEnvelope> {
        return this.promise.catch(onrejected);
    }

    /** Is Response Payload
     *
     * The PayloadResponse tags the payloads, so it expects a unique message back.
     *
     * @returns True if this payload has been tagged by a PayloadResponse class
     */
    static isResponsePayloadEnvelope(payloadEnvelope: PayloadEnvelope) {
        return payloadEnvelope.filt.hasOwnProperty(PayloadResponse.messageIdKey);
    }

    get status(this) {
        return this._status;
    }
}

