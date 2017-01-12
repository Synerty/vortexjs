/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {PayloadEndpointComponent} from "./payload-endpoint.component";
import {VortexService} from "../../vortex/VortexService";
import {Ng2BalloonMsgService} from "@synerty/ng2-balloon-msg";

describe('PayloadEndpointComponent', () => {
    let component: PayloadEndpointComponent;
    let fixture: ComponentFixture<PayloadEndpointComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PayloadEndpointComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PayloadEndpointComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('testFiltMatches', () => {
        expect(component.testFiltMatches).toBeTruthy();

    });

    it('testShutdown', () => {
        expect(component.testShutdown).toBeTruthy();

    });

    it('testFiltValueUnmatched', () => {
        expect(component.testFiltValueUnmatched).toBeTruthy();

    });

    it('testFiltKeyUnmatched', () => {
        expect(component.testFiltKeyUnmatched).toBeTruthy();

    });


});
