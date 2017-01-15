/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TupleOfflineObserverComponent } from './tuple-offline-observer.component';

describe('TupleOfflineObserverComponent', () => {
  let component: TupleOfflineObserverComponent;
  let fixture: ComponentFixture<TupleOfflineObserverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TupleOfflineObserverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TupleOfflineObserverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
