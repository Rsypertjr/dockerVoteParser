import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestChartsjsComponent } from './test-chartsjs.component';

describe('TestChartsjsComponent', () => {
  let component: TestChartsjsComponent;
  let fixture: ComponentFixture<TestChartsjsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestChartsjsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestChartsjsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
