"use strict";
/* tslint:disable:no-unused-variable */
var testing_1 = require("@angular/core/testing");
var payload_endpoint_component_1 = require("./payload-endpoint.component");
describe('PayloadEndpointComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [payload_endpoint_component_1.PayloadEndpointComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(payload_endpoint_component_1.PayloadEndpointComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
    it('testFiltMatches', function () {
        expect(component.testFiltMatches).toBeTruthy();
    });
    it('testShutdown', function () {
        expect(component.testShutdown).toBeTruthy();
    });
    it('testFiltValueUnmatched', function () {
        expect(component.testFiltValueUnmatched).toBeTruthy();
    });
    it('testFiltKeyUnmatched', function () {
        expect(component.testFiltKeyUnmatched).toBeTruthy();
    });
});
//# sourceMappingURL=/home/peek/project/vortexjs/src/app/payload-endpoint/payload-endpoint.component.spec.js.map