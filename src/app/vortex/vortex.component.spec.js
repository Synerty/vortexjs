"use strict";
/* tslint:disable:no-unused-variable */
var testing_1 = require("@angular/core/testing");
var vortex_component_1 = require("./vortex.component");
var VortexService_1 = require("../../vortex/VortexService");
var ng2_balloon_msg_1 = require("@synerty/ng2-balloon-msg");
describe('VortexComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [vortex_component_1.VortexComponent],
            providers: [VortexService_1.VortexService, ng2_balloon_msg_1.Ng2BalloonMsgService]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(vortex_component_1.VortexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
    it('testVortexHttpReconnect', function () {
        expect(component.testVortexHttpReconnect()).toBeTruthy();
    });
    it('testVortexWebSocketReconnect', function () {
        expect(component.testVortexWebSocketReconnect()).toBeTruthy();
    });
});
//# sourceMappingURL=/home/peek/project/vortexjs/src/app/vortex/vortex.component.spec.js.map