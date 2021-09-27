import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppComponent } from '../app.component';
import { VotesTableComponent } from './votes-table.component';


describe('VotesTableComponent', () => {
  let component: VotesTableComponent;
  let fixture: ComponentFixture<VotesTableComponent>;
  const initialState = { loggedIn: false };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [ AppComponent, VotesTableComponent ]
    })
    .compileComponents();
  });

  
  beforeEach(() => {
    fixture = TestBed.createComponent(VotesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
