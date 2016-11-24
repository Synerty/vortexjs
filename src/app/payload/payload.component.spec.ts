/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import {VortexService} from "../../vortex/Vortex";
import {Ng2BalloonMsgService} from "@synerty/ng2-balloon-msg";

import { PayloadComponent } from './payload.component';

describe('PayloadComponent', () => {
  let component: PayloadComponent;
  let fixture: ComponentFixture<PayloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayloadComponent ],
            providers: [VortexService, Ng2BalloonMsgService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('testPayloadEcho2Hop', () => {
    expect(component.testPayloadEcho2Hop()).toBeTruthy();
  });

  it('testPayloadToFromVortexMsg', () => {
    expect(component.testPayloadToFromVortexMsg()).toBeTruthy();
  });
});
