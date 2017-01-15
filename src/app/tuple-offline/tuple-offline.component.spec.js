"use strict";
/* tslint:disable:no-unused-variable */
var testing_1 = require("@angular/core/testing");
var tuple_offline_component_1 = require("./tuple-offline.component");
describe('TupleOfflineComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [tuple_offline_component_1.TupleOfflineComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(tuple_offline_component_1.TupleOfflineComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=/home/peek/project/vortexjs/src/src/app/tuple-offline/tuple-offline.component.spec.js.map