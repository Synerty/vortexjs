import {VortexClientABC} from "./VortexClientABC";
import {Payload, IPayloadFilt} from "./Payload";
import {dateStr} from "./UtilMisc";
import {VortexService} from "./VortexService";
import {ComponentLifecycleEventEmitter} from "./ComponentLifecycleEventEmitter";

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
export class PayloadResponse extends Promise<Payload> {


    private static messageIdKey = "PayloadResponse.messageId";

    readonly PROCESSING = "Processing";
    // NO_ENDPOINT = "No Endpoint"
    readonly FAILED = "Failed";
    readonly SUCCESS = "Success";
    readonly TIMED_OUT = "Timed Out";

    private _messageId: string = VortexClientABC.makeUuid();
    private _status: string = this.PROCESSING;

    private _lcEmitter: ComponentLifecycleEventEmitter
        = new ComponentLifecycleEventEmitter();

    /** Constructor
     * @param payload: The payload to mark and send.
     * @param timeout: The timeout to wait for a response - in seconds;
     * @param resultCheck: Should the result of the payload response be checked.
     */
    constructor(vortexService: VortexService,
                private payload: Payload,
                private timeout: number = 10.000,
                private resultCheck: boolean = true) {
        super((resolve, reject) => {

            // Start the timer
            let timer = setTimeout(() => {
                let msg = `Timed out for payload ${payload.filt.toString()}`;
                console.log(`${dateStr()} ERR: ${msg}`);
                this._status = this.TIMED_OUT;
                reject(msg);
                this._lcEmitter.onDestroyEvent.emit("OnDestroy");
            }, timeout * 1000);

            // Create the endpoint
            payload.filt[PayloadResponse.messageIdKey] = this._messageId;
            let endpoint = vortexService.createEndpoint(
                this._lcEmitter, (<IPayloadFilt>payload.filt));

            // Subscribe
            endpoint.observable.subscribe((payload) => {
                clearTimeout(timer);
                endpoint.shutdown();

                let r = payload.result; // success is null or true
                if (this.resultCheck && !(r == null || r === true)) {
                    this._status = this.FAILED;
                    reject(payload.result.toString());

                } else {
                    this._status = this.SUCCESS;
                    resolve(payload);
                }

                this._lcEmitter.onDestroyEvent.emit("OnDestroy");
            });

            vortexService.sendPayload(payload);
        });
    }

    /* Is Response Payload
     *
     * The PayloadResponse tags the payloads, so it expects a unique message back.
     *
     * :returns: True if this payload has been tagged by a PayloadResponse class
     */
    static isResponsePayload(payload) {
        return payload.filt.hasOwnProperty(PayloadResponse.messageIdKey);
    }

    get
    status(this) {
        return this._status;
    }
}

