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
  selected_sort:string;
  @Input() selected_index:number;
  @Output() thePresVotes: any[];  

  state_selected:string;
  parse_interval:number;
  state:string = "Alabama";    
  raceData : RaceInfo;  
  theRaceId:string;   
  vote_rows: any[];
  
  headers : string[] = ["Index","Biden %","Biden Votes","Trump %","Trump Votes","Other Votes","Time Stamps","Votes", "Votes Added","Trump Added","Biden Added","% of Remaining Biden","% of Remaining Trump"];
    
  states: string[] = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho",
            "Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota",
            "Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina",
            "North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee",
            "Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]; 
  sorts:string[] = ["Time Stamps","Cumulative Vote Totals"]; 
 
  constructor(private getState:GetstateService) { }

 

  getVotes = map((res:any) => {
    let jobj:any = res;
    console.log("Data: ", jobj);
  
    let timeseries = jobj.data.races[0].timeseries;
    console.log(jobj);
    this.raceData.raceId =  jobj.data.races[0].race_id;
    this.raceData.raceSlug =  jobj.data.races[0].race_slug;
    this.raceData.raceUrl = jobj.data.races[0].url; 
    let raceId = this.raceData.raceId;
    console.log("Race Data:", raceId);
    console.log("Intial Data:", timeseries);      
    this.theRaceId = raceId; 
    console.log("The Race Id: ",this.theRaceId);
    
  
  
          
    // Parse Votes for Master Table
    var total_trump_increase = 0;
    function calc_votes(votes,index){
        let per_adj = votes.vote_shares.bidenj+votes.vote_shares.trumpd;
        let biden = votes.vote_shares.bidenj*votes.votes;
        
        let vote_row = {      
        "index": index,
        "votes": votes.votes,
        "timestamp": votes.timestamp,
        "bidenj": votes.vote_shares.bidenj,
        "biden_votes":0,
        "trumpd": votes.vote_shares.trumpd,
        "trump_votes":0,
        "other_votes":0,
        "total_vote_add":0,
        "total_vote_add_trump":0,
        "total_vote_add_biden":0,
        "total_vote_add_other":0,
        "total_vote_add_total":0,
        "percent_of_remaining_trump":0,
        "percent_of_remaining_biden":0,
        //"total_vote_add_bdiff":0,
        // "total_vote_add_tdiff":0,
        "time":votes.timestamp
        };
                            
        return vote_row;
    }
  
  
    let presVotes = timeseries.map(calc_votes);
    console.log("Pres Votes: ", presVotes);
    this.thePresVotes = presVotes;
  
    var pres_votes = this.thePresVotes;
  
  
    
    pres_votes = pres_votes.map(function(votes,index){
      if(index == 0){
          votes.biden_votes = votes.bidenj*votes.votes;
          votes.trump_votes = votes.trumpd*votes.votes;
          votes.total_vote_add = votes.votes;
          votes.total_vote_add_trump = votes.votes * votes.trumpd;
          votes.total_vote_add_biden = votes.votes * votes.bidenj;
          votes.total_vote_add_other = votes.votes - (votes.votes * votes.trumpd + votes.votes * votes.bidenj);
          //votes.total_vote_add_bdiff = votes.votes * votes.bidenj - votes.votes * votes.trumpd;
          //votes.total_vote_add_tdiff = votes.votes * votes.trumpd - votes.votes * votes.bidenj;
          votes.other_votes = (1-votes.bidenj-votes.trumpd)*votes.votes;
      }
      else if(index > 0){
      
          
          if(votes.votes == 0)
              votes.total_vote_add = 0;
          else 
              votes.total_vote_add = pres_votes[index].votes - pres_votes[index-1].votes;
  
  
          if(votes.bidenj == 0)
              votes.biden_votes = 0;
              //votes.biden_votes = pres_votes[index-1].biden_votes + votes.total_vote_add*votes.bidenj;
              votes.biden_votes = votes.bidenj*votes.votes;
          
          if(votes.trumpd == 0)
              votes.trump_votes = 0;
          else  
          //votes.trump_votes = pres_votes[index-1].trump_votes + votes.total_vote_add*votes.trumpd;
          votes.trump_votes = votes.trumpd*votes.votes;
  
          votes.other_votes = votes.votes - votes.biden_votes - votes.trump_votes;
  
          //votes.total_vote_add_trump = (pres_votes[index].votes - pres_votes[index-1].votes) * votes.trumpd;
          votes.total_vote_add_trump = votes.votes*votes.trumpd - pres_votes[index-1].votes*pres_votes[index-1].trumpd;
          //votes.total_vote_add_biden = (pres_votes[index].votes - pres_votes[index-1].votes) * votes.bidenj;
          votes.total_vote_add_biden = votes.votes*votes.bidenj - pres_votes[index-1].votes*pres_votes[index-1].bidenj;
          votes.total_vote_add_other = (1-votes.bidenj-votes.trumpd)*votes.votes - pres_votes[index-1].votes*(1 - pres_votes[index-1].bidenj - pres_votes[index-1].trumpd);
          votes.total_vote_add_total = pres_votes[index].votes - pres_votes[index-1].votes;
        // votes.total_vote_add_bdiff = (votes.votes*votes.bidenj - pres_votes[index-1].votes*pres_votes[index-1].bidenj) - (votes.votes*votes.trumpd - pres_votes[index-1].votes*pres_votes[index-1].trumpd);
        // votes.total_vote_add_tdiff = (votes.votes*votes.trumpd - pres_votes[index-1].votes*pres_votes[index-1].trumpd) - (votes.votes*votes.bidenj - pres_votes[index-1].votes*pres_votes[index-1].bidenj);
      }
      return votes;
  });
  console.log("Total Votes:",pres_votes);
  
  
  console.log("Sort Selected: ",this.selected_sort);
  var totalnum_votes = pres_votes[pres_votes.length-1].votes;
  console.log("Total Num of Votes: ",totalnum_votes);
  if(this.selected_sort && this.selected_sort.includes('Time')) {    
      var temp_rows = pres_votes.map(function(vote,index){                            
          //return {"votes":vote.votes,"timestamp":vote.timestamp,"bidenj":vote.bidenj,"trumpd":vote.trumpd};
          vote.percent_of_remaining_trump = vote.total_vote_add_trump*100/(totalnum_votes-vote.votes);
          vote.percent_of_remaining_biden = vote.total_vote_add_biden*100/(totalnum_votes-vote.votes);
          return vote;
      }).sort(function(a, b){return a.timestamp - b.timestamp});
  }
  if(this.selected_sort && this.selected_sort.includes('Vote')) {
      var temp_rows = pres_votes.map(function(vote,index){                            
          //return {"votes":vote.votes,"timestamp":vote.timestamp,"bidenj":vote.bidenj,"trumpd":vote.trumpd};
          vote.percent_of_remaining_trump = vote.total_vote_add_trump*100/(totalnum_votes-vote.votes);
          vote.percent_of_remaining_biden = vote.total_vote_add_biden*100/(totalnum_votes-vote.votes);
          return vote;
      }).sort(function(a, b){return a.votes - b.votes}); 
  }
  
  console.log("Total Votes Again:",temp_rows);
  
  this.vote_rows = temp_rows.map(function(vote,index){
      return {"index":index,"bidenj":vote.bidenj,"biden_votes":vote.biden_votes,"trumpd":vote.trumpd,"trump_votes":vote.trump_votes,"other_votes":vote.other_votes,"timestamp":vote.timestamp,"votes":vote.votes,"vote_add":vote.total_vote_add,"trump_added":vote.total_vote_add_trump,
          "biden_added":vote.total_vote_add_biden, "remaining_percent_trump":vote.percent_of_remaining_trump,"remaining_percent_biden": vote.percent_of_remaining_biden};
  });
  console.log("Vote Rows:", this.vote_rows);
  return this.vote_rows;
  
  });  
  



  selectChange(){      
    this.state = this.state_selected;
    const voterRows$ = this.getState.get_state(this.state).pipe(this.getVotes);
    voterRows$.subscribe((res:any) => {   
      this.thePresVotes = res;
      this.votesTable.rerender(res);
      //this.votesTable.render_table(this.state);  
     }); 
  }
  
  selectSort(){
    this.state = this.state_selected;
    const voterRows$ = this.getState.get_state(this.state).pipe(this.getVotes);
    voterRows$.subscribe((res:any) => {   
      this.thePresVotes = res;
      this.votesTable.rerender(res);
      //this.votesTable.render_table(this.state);  
     }); 
  }

  
  ngOnInit(): void {
    this.state = "Alabama";
    this.state_selected = "Alabama";
    this.selected_sort = "Time Stamps";
    this.parse_interval = 10;    
    this.raceData = {
      "raceId": "",
      "raceSlug":"", 
      "raceUrl":""
    }; 
    const voterRows$ = this.getState.get_state(this.state).pipe(this.getVotes);
    voterRows$.subscribe((res:any) => {   
      this.thePresVotes = res;
      this.votesTable.render_table();
      this.votesTable.drawCharts(this.thePresVotes);
      //this.votesTable.render_table(this.state);  
     }); 
     
  }


}
