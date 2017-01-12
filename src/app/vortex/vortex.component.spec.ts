/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {VortexComponent} from "./vortex.component";
import {VortexService} from "../../vortex/VortexService";
import {Ng2BalloonMsgService} from "@synerty/ng2-balloon-msg";

describe('VortexComponent', () => {
    let component: VortexComponent;
    let fixture: ComponentFixture<VortexComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [VortexComponent],
            providers: [VortexService, Ng2BalloonMsgService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(VortexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('testVortexHttpReconnect', () => {
        expect(component.testVortexHttpReconnect()).toBeTruthy();
    });

    it('testVortexWebSocketReconnect', () => {
        expect(component.testVortexWebSocketReconnect()).toBeTruthy();
    });
});
