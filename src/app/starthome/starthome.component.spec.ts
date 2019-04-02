/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StarthomeComponent } from './starthome.component';

describe('StarthomeComponent', () => {
  let component: StarthomeComponent;
  let fixture: ComponentFixture<StarthomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarthomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarthomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
