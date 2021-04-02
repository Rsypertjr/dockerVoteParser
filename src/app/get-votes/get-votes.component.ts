import { Component, OnDestroy, OnInit, ViewChild, Input, Output } from '@angular/core';
import { RaceInfo } from '../race-info';
import { Observable, throwError, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
import { GetstateService} from '../getstate.service';
import { VotesTableComponent } from '../votes-table/votes-table.component';
import { VoteChartsComponent } from '../vote-charts/vote-charts.component';


@Component({
  selector: 'app-get-votes',
  templateUrl: './get-votes.component.html',
  styleUrls: ['./get-votes.component.css']
})
export class GetVotesComponent implements OnInit {
  @ViewChild(VotesTableComponent) votesTable: VotesTableComponent;
  
  
  @Output() selected_sort:string;
  state_selected:string;
  parse_interval:number;
  state:string = "Alabama";  
  @Input() selected_index:number;
  @Output() thePresVotes: any[];  
  vote_rows: any[];
  
  headers : string[] = ["Index","Biden %","Biden Votes","Trump %","Trump Votes","Other Votes","Time Stamps","Votes", "Votes Added","Trump Added","Biden Added","% of Remaining Biden","% of Remaining Trump"];
    
  states: string[] = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho",
            "Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota",
            "Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina",
            "North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee",
            "Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]; 
  sorts:string[] = ["Time Stamps","Cumulative Vote Totals"]; 
 
  constructor(private getState:GetstateService) { }

 

  selectChange(){      
    this.state = this.state_selected;
    const voterRows$ = this.getState.get_state(this.state).pipe(this.votesTable.getVotes);
    voterRows$.subscribe((res:any) => {   
      this.thePresVotes = res;
      this.votesTable.rerender(this.thePresVotes, this.state);  
     }); 
  }
  
  selectSort(){
    this.state = this.state_selected;
    const voterRows$ = this.getState.get_state(this.state).pipe(this.votesTable.getVotes);
    voterRows$.subscribe((res:any) => {   
      this.thePresVotes = res;
      this.votesTable.rerender(this.thePresVotes, this.state);  
     }); 
  }

  
  ngOnInit(): void {
    this.state = "alabama";
    this.state_selected = "Alabama";
    this.selected_sort = "Time Stamps";
    this.parse_interval = 10;
 
     
  }


}
