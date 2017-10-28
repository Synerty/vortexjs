"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Payload_1 = require("./Payload");
var UtilMisc_1 = require("./UtilMisc");
var VortexService_1 = require("./VortexService");
var ComponentLifecycleEventEmitter_1 = require("./ComponentLifecycleEventEmitter");
var VortexStatusService_1 = require("./VortexStatusService");
var core_1 = require("@angular/core");
var TupleActionProcessorNameService = (function () {
    function TupleActionProcessorNameService(name, additionalFilt) {
        if (additionalFilt === void 0) { additionalFilt = {}; }
        this.name = name;
        this.additionalFilt = additionalFilt;
    }
    return TupleActionProcessorNameService;
}());
TupleActionProcessorNameService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [String, Object])
], TupleActionProcessorNameService);
exports.TupleActionProcessorNameService = TupleActionProcessorNameService;
var TupleActionProcessorService = (function (_super) {
    __extends(TupleActionProcessorService, _super);
    function TupleActionProcessorService(tupleActionProcessorName, vortexService, vortexStatusService) {
        var _this = _super.call(this) || this;
        _this.tupleActionProcessorName = tupleActionProcessorName;
        _this.vortexService = vortexService;
        _this.vortexStatusService = vortexStatusService;
        _this._tupleProcessorsByTupleName = {};
        _this.defaultDelegate = null;
        var filt = UtilMisc_1.extend({
            name: tupleActionProcessorName.name,
            key: "tupleActionProcessorName"
        }, tupleActionProcessorName.additionalFilt);
        vortexService.createEndpointObservable(_this, filt)
            .subscribe(function (payload) { return _this._process(payload); });
        return _this;
    }
    /** Add Tuple Action Processor Delegate
     *
     *@param tupleName: The tuple name to process actions for.
     *@param processor: The processor to use for processing this tuple name.
     *
     */
    TupleActionProcessorService.prototype.setDelegate = function (tupleName, delegate) {
        UtilMisc_1.assert(tupleName in this._tupleProcessorsByTupleName, "TupleActionProcessor:" + this.tupleActionProcessorName.name + ", "
            + ("Tuple name " + tupleName + " is already registered"));
        this._tupleProcessorsByTupleName[tupleName] = delegate;
    };
    /** Set Default Tuple Action Processor Delegate
     *
     *@param processor: The processor to use for processing unhandled TupleActions.
     *
     */
    TupleActionProcessorService.prototype.setDefaultDelegate = function (delegate) {
        this.defaultDelegate = delegate;
    };
    /** Process the Payload / Tuple Action
     *
     */
    TupleActionProcessorService.prototype._process = function (payload) {
        var _this = this;
        UtilMisc_1.assert(payload.tuples.length === 1, "TupleActionProcessor:" + this.tupleActionProcessorName.name
            + ("Expected 1 tuples, received " + payload.tuples.length));
        var tupleAction = payload.tuples[0];
        var tupleName = tupleAction._tupleName();
        var delegate = null;
        var processor = this._tupleProcessorsByTupleName[tupleName];
        if (processor != null) {
            delegate = processor;
        }
        else if (this.defaultDelegate != null) {
            delegate = this.defaultDelegate;
        }
        else {
            console.log("ERROR No delegate registered for " + tupleName);
            return;
            // throw new Error(`No delegate registered for ${tupleName}`);
        }
        var promise = delegate.processTupleAction(tupleAction);
        promise.then(function (tuples) { return _this.callback(tuples, payload.filt, tupleName); });
        promise.catch(function (err) { return _this.errback(err, payload.filt, tupleName); });
    };
    TupleActionProcessorService.prototype.callback = function (tuples, replyFilt, tupleName) {
        var payload = new Payload_1.Payload(replyFilt, tuples);
        this.vortexService.sendPayload(payload);
    };
    TupleActionProcessorService.prototype.errback = function (err, replyFilt, tupleName) {
        this.vortexStatusService.logError("TupleActionProcessor:" + this.tupleActionProcessorName.name +
            (" Failed to process TupleActon, " + err));
        var payload = new Payload_1.Payload(replyFilt);
        payload.result = err;
        this.vortexService.sendPayload(payload);
    };
    return TupleActionProcessorService;
}(ComponentLifecycleEventEmitter_1.ComponentLifecycleEventEmitter));
TupleActionProcessorService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [TupleActionProcessorNameService,
        VortexService_1.VortexService,
        VortexStatusService_1.VortexStatusService])
], TupleActionProcessorService);
exports.TupleActionProcessorService = TupleActionProcessorService;
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/TupleActionProcessorService.js.map