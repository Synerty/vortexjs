/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TupleObserverComponent } from './tuple-observer.component';

describe('TupleObserverComponent', () => {
  let component: TupleObserverComponent;
  let fixture: ComponentFixture<TupleObserverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TupleObserverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TupleObserverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
