import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppComponent } from '../app.component';
import { VoteChartsComponent } from './vote-charts.component';
import { VotesTableComponent } from '../votes-table/votes-table.component';
import { GetPageinfoService} from '../get-pageinfo.service';
import { ParseVotesService} from '../parse-votes.service';


describe('VoteChartsComponent', () => {
  let component: VoteChartsComponent;
  let fixture: ComponentFixture<VoteChartsComponent>;
  const initialState = { loggedIn: false };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [ AppComponent, VotesTableComponent, VoteChartsComponent ],
      providers: [GetPageinfoService,ParseVotesService]
     
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
