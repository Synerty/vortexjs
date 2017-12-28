import { Payload } from "./Payload";
import { VortexService } from "./VortexService";
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
export declare class PayloadResponse {
    private payload;
    private timeout;
    private resultCheck;
    static readonly RESPONSE_TIMEOUT_SECONDS: number;
    private static messageIdKey;
    readonly PROCESSING: string;
    readonly FAILED: string;
    readonly SUCCESS: string;
    readonly TIMED_OUT: string;
    private _messageId;
    private _status;
    private _lcEmitter;
    private promise;
    /** Constructor
     * @param vortexService:
     * @param payload: The payload to mark and send.
     * @param timeout: The timeout to wait for a response - in seconds;
     * @param resultCheck: Should the result of the payload response be checked.
     */
    constructor(vortexService: VortexService, payload: Payload, timeout?: number, resultCheck?: boolean);
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then(onfulfilled: any, onrejected?: any): Promise<Payload>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch(onrejected: any): Promise<Payload>;
    /** Is Response Payload
     *
     * The PayloadResponse tags the payloads, so it expects a unique message back.
     *
     * @returns True if this payload has been tagged by a PayloadResponse class
     */
    static isResponsePayload(payload: any): any;
    readonly status: any;
}
