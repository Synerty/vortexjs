"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-variable */
var testing_1 = require("@angular/core/testing");
var tuple_offline_observer_component_1 = require("./tuple-offline-observer.component");
describe('TupleOfflineObserverComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [tuple_offline_observer_component_1.TupleOfflineObserverComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(tuple_offline_observer_component_1.TupleOfflineObserverComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=/home/peek/project/vortexjs/src/app/tuple-offline-observer/tuple-offline-observer.component.spec.js.map