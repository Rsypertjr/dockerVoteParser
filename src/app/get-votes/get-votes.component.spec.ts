import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppComponent } from '../app.component';
import { GetVotesComponent } from './get-votes.component';

describe('GetVotesComponent', () => {
  let component: GetVotesComponent;
  let fixture: ComponentFixture<GetVotesComponent>;
  const initialState = { loggedIn: false };
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({ 
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [  AppComponent, GetVotesComponent ]
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
