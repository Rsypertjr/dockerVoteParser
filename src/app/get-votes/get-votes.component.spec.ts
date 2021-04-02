import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetVotesComponent } from './get-votes.component';

describe('GetVotesComponent', () => {
  let component: GetVotesComponent;
  let fixture: ComponentFixture<GetVotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetVotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetVotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
