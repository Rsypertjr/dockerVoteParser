import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteChartsComponent } from './vote-charts.component';

describe('VoteChartsComponent', () => {
  let component: VoteChartsComponent;
  let fixture: ComponentFixture<VoteChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoteChartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoteChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
