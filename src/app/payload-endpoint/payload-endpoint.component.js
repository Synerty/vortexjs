"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var Payload_1 = require("../../vortex/Payload");
var PayloadEndpoint_1 = require("../../vortex/PayloadEndpoint");
var ComponentLifecycleEventEmitter_1 = require("../../vortex/ComponentLifecycleEventEmitter");
var PayloadIO_1 = require("../../vortex/PayloadIO");
var UtilMisc_1 = require("../../vortex/UtilMisc");
var PayloadEndpointComponent = (function (_super) {
    __extends(PayloadEndpointComponent, _super);
    function PayloadEndpointComponent() {
        var _this = _super.call(this) || this;
        _this._deliveredPayload = null;
        _this._payloadEndpoint = null;
        _this._payload = null;
        return _this;
    }
    PayloadEndpointComponent.prototype.ngOnInit = function () {
    };
    PayloadEndpointComponent.prototype._testBuild = function (plFilt, epFilt) {
        var _this = this;
        var payload = new Payload_1.Payload();
        Object.assign(payload.filt, plFilt);
        for (var x = 0; x < 6; ++x)
            payload.filt[x] = x;
        // This will interfere with the test
        if (this._payloadEndpoint != null)
            this._payloadEndpoint.shutdown();
        this._payloadEndpoint = new PayloadEndpoint_1.PayloadEndpoint(this, epFilt);
        this._payloadEndpoint.observable.subscribe(function (payload) { return _this._deliveredPayload = payload; });
        PayloadIO_1.payloadIO.process(payload);
        this._payload = payload;
        return payload;
    };
    PayloadEndpointComponent.prototype.testFiltMatches = function () {
        var plFilt = {
            key: 'key test',
            'This matches': 555
        };
        var epFilt = {
            key: 'key test',
            'This matches': 555
        };
        var payload = this._testBuild(plFilt, epFilt);
        UtilMisc_1.assert(this._deliveredPayload != null, 'PayloadIO/PayloadEndpoint delivery error');
        UtilMisc_1.assert(payload.equals(this._deliveredPayload), 'PayloadIO/PayloadEndpoint delivery compare error');
        console.log('TestPayloadEndpoint.testFiltMatches test complete');
        return true;
    };
    PayloadEndpointComponent.prototype.testShutdown = function () {
        // Run the last test, we know this matches
        this.testFiltMatches();
        // Reset the delivered payload
        this._deliveredPayload = null;
        this._payloadEndpoint.shutdown();
        PayloadIO_1.payloadIO.process(this._payload);
        UtilMisc_1.assert(this._deliveredPayload == null, 'PayloadIO/PayloadEndpoint shutdown error');
        console.log('TestPayloadEndpoint.testShutdown test complete');
        return true;
    };
    PayloadEndpointComponent.prototype.testFiltValueUnmatched = function () {
        var plFilt = {
            key: 'key test',
            'This matches': 555
        };
        var epFilt = {
            key: 'key test',
            'This matches': 0
        };
        this._testBuild(plFilt, epFilt);
        UtilMisc_1.assert(this._deliveredPayload == null, 'PayloadIO/PayloadEndpoint unmatched value test error');
        console.log('TestPayloadEndpoint.testFiltValueUnmatched test complete');
        return true;
    };
    PayloadEndpointComponent.prototype.testFiltKeyUnmatched = function () {
        var plFilt = {
            key: 'key test',
            'This matches': 555
        };
        var epFilt = {
            key: 'key test',
            'This doesnt matches': 555
        };
        this._testBuild(plFilt, epFilt);
        UtilMisc_1.assert(this._deliveredPayload == null, 'PayloadIO/PayloadEndpoint unmatched value test error');
        console.log('TestPayloadEndpoint.testFiltKeyUnmatched test complete');
        return true;
    };
    return PayloadEndpointComponent;
}(ComponentLifecycleEventEmitter_1.ComponentLifecycleEventEmitter));
PayloadEndpointComponent = __decorate([
    core_1.Component({
        selector: 'app-payload-endpoint',
        templateUrl: './payload-endpoint.component.html',
        styleUrls: ['./payload-endpoint.component.css']
    }),
    __metadata("design:paramtypes", [])
], PayloadEndpointComponent);
exports.PayloadEndpointComponent = PayloadEndpointComponent;
//# sourceMappingURL=payload-endpoint.component.js.map