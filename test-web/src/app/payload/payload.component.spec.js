"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-variable */
var testing_1 = require("@angular/core/testing");
var VortexService_1 = require("../../vortex/VortexService");
var ng2_balloon_msg_1 = require("@synerty/ng2-balloon-msg");
var payload_component_1 = require("./payload.component");
describe('PayloadComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [payload_component_1.PayloadComponent],
            providers: [VortexService_1.VortexService, ng2_balloon_msg_1.Ng2BalloonMsgService]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(payload_component_1.PayloadComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
    it('testPayloadEcho2Hop', function () {
        expect(component.testPayloadEcho2Hop()).toBeTruthy();
    });
    it('testPayloadToFromVortexMsg', function () {
        expect(component.testPayloadToFromVortexMsg()).toBeTruthy();
    });
});
//# sourceMappingURL=/home/peek/project/vortexjs/src/app/payload/payload.component.spec.js.map