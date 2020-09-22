import {Component, OnInit} from "@angular/core";
import {Payload} from "../../vortex/Payload";
import {PayloadEndpoint} from "../../vortex/PayloadEndpoint";
import { NgLifeCycleEvents } from "@synerty/peek-plugin-base-js"
import {payloadIO} from "../../vortex/PayloadIO";
import {assert} from "../../vortex/UtilMisc";


@Component({
    selector: 'app-payload-endpoint',
    templateUrl: './payload-endpoint.component.html',
    styleUrls: ['./payload-endpoint.component.css']
})
export class PayloadEndpointComponent extends NgLifeCycleEvents implements OnInit {

    _deliveredPayload = null;
    _payloadEndpoint = null;
    _payload = null;

    constructor() {
        super();
    }

    ngOnInit() {
    }


    _testBuild(plFilt, epFilt) {
        let payload = new Payload();
        Object.assign(payload.filt, plFilt);

        for (let x = 0; x < 6; ++x)
            payload.filt[x] = x;

        // This will interfere with the test
        if (this._payloadEndpoint != null)
            this._payloadEndpoint.shutdown();

        this._payloadEndpoint = new PayloadEndpoint(this, epFilt);
        this._payloadEndpoint.observable.subscribe(payload => this._deliveredPayload = payload);

        payloadIO.process(payload);

        this._payload = payload;
        return payload;
    }

    testFiltMatches() {
        let plFilt = {
            key:'key test',
            'This matches': 555
        };
        let epFilt = {
            key:'key test',
            'This matches': 555
        };

        let payload = this._testBuild(plFilt, epFilt);

        assert(this._deliveredPayload != null,
            'PayloadIO/PayloadEndpoint delivery error');

        assert(payload.equals(this._deliveredPayload),
            'PayloadIO/PayloadEndpoint delivery compare error');

        console.log('TestPayloadEndpoint.testFiltMatches test complete');
        return true;
    }

    testShutdown() {
        // Run the last test, we know this matches
        this.testFiltMatches();

        // Reset the delivered payload
        this._deliveredPayload = null;

        this._payloadEndpoint.shutdown();

        payloadIO.process(this._payload);

        assert(this._deliveredPayload == null,
            'PayloadIO/PayloadEndpoint shutdown error');

        console.log('TestPayloadEndpoint.testShutdown test complete');
        return true;
    }

    testFiltValueUnmatched() {
        let plFilt = {
            key:'key test',
            'This matches': 555
        };
        let epFilt = {
            key:'key test',
            'This matches': 0
        };

        this._testBuild(plFilt, epFilt);

        assert(this._deliveredPayload == null,
            'PayloadIO/PayloadEndpoint unmatched value test error');

        console.log('TestPayloadEndpoint.testFiltValueUnmatched test complete');
        return true;
    }

    testFiltKeyUnmatched() {
        let plFilt = {
            key:'key test',
            'This matches': 555
        };
        let epFilt = {
            key:'key test',
            'This doesnt matches': 555
        };

        this._testBuild(plFilt, epFilt);

        assert(this._deliveredPayload == null,
            'PayloadIO/PayloadEndpoint unmatched value test error');

        console.log('TestPayloadEndpoint.testFiltKeyUnmatched test complete');
        return true;
    }

}


