"use strict";
/* tslint:disable:no-unused-variable */
var testing_1 = require("@angular/core/testing");
var tuple_component_1 = require("./tuple.component");
var VortexService_1 = require("../../vortex/VortexService");
var ng2_balloon_msg_1 = require("@synerty/ng2-balloon-msg");
describe('TupleComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [tuple_component_1.TupleComponent],
            providers: [VortexService_1.VortexService, ng2_balloon_msg_1.Ng2BalloonMsgService]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(tuple_component_1.TupleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
    it('testTupleEcho', function () {
        expect(component.testTupleEcho()).toBeTruthy();
    });
    it('testTupleToFromJson', function () {
        expect(component.testTupleToFromJson()).toBeTruthy();
    });
    it('testJsonableEquals', function () {
        expect(component.testJsonableEquals()).toBeTruthy();
    });
});
//# sourceMappingURL=/home/peek/project/vortexjs/src/app/tuple/tuple.component.spec.js.map