/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TupleActionComponent } from './tuple-action.component';

describe('TupleActionComponent', () => {
  let component: TupleActionComponent;
  let fixture: ComponentFixture<TupleActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TupleActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TupleActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
