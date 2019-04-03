/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DaysaleComponent } from './daysale.component';

describe('DaysaleComponent', () => {
  let component: DaysaleComponent;
  let fixture: ComponentFixture<DaysaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaysaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaysaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
