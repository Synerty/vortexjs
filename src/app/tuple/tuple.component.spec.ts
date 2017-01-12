/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {TupleComponent} from "./tuple.component";
import {VortexService} from "../../vortex/VortexService";
import {Ng2BalloonMsgService} from "@synerty/ng2-balloon-msg";

describe('TupleComponent', () => {
    let component: TupleComponent;
    let fixture: ComponentFixture<TupleComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TupleComponent],
            providers: [VortexService, Ng2BalloonMsgService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TupleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('testTupleEcho', () => {
        expect(component.testTupleEcho()).toBeTruthy();
    });

    it('testTupleToFromJson', () => {
        expect(component.testTupleToFromJson()).toBeTruthy();
    });

    it('testJsonableEquals', () => {
        expect(component.testJsonableEquals()).toBeTruthy();
    });

});
