import PayloadEndpoint from "./PayloadEndpoint";

export let STOP_PROCESSING = "STOP_PROCESSING";

class PayloadIO {
    private _endpoints: PayloadEndpoint[];

    constructor() {
        let self = this;
        self._endpoints = [];
    }

    add(endpoint) {
        let self = this;
        self._endpoints.add(endpoint);
    }

    remove(endpoint) {
        let self = this;
        self._endpoints.remove(endpoint);
    }


    process(payload) {
        let self = this;
        // Make a copy of the endpoints array, it may change endpoints
        // can remove them selves during iteration.
        let endpoints = self._endpoints.slice(0);
        for (let i = 0; i < endpoints.length; ++i) {
            if (endpoints[i].process(payload) === STOP_PROCESSING)
                break;
        }
    }

}

let payloadIO = new PayloadIO();

export default payloadIO;