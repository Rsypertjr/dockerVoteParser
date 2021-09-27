import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  const initialState = { loggedIn: false };



  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {    
    expect(component).toBeTruthy();
  });

  it(`should have as title 'vote-parser'`, () => {   
    expect(component.title).toEqual('vote-parser');
  });

 /*
 it('should render title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('body > app-root > app-get-votes > div.container-fluid > div > h1').textContent).toContain('2020 Presidential Election Parser');
  });
  */
  
});
