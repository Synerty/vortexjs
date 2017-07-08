"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-variable */
var testing_1 = require("@angular/core/testing");
var tuple_action_offline_component_1 = require("./tuple-action-offline.component");
describe('TupleActionOfflineComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [tuple_action_offline_component_1.TupleActionOfflineComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(tuple_action_offline_component_1.TupleActionOfflineComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=/home/peek/project/vortexjs/src/app/tuple-action-offline/tuple-action-offline.component.spec.js.map