import { Component, OnDestroy, OnInit,AfterViewInit, ViewChild, Input, Output, ElementRef } from '@angular/core';
import { RaceInfo } from '../race-info';
import { VoteRows } from '../vote-rows';
import { Observable, throwError, Subject, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';
import { GetstateService} from '../getstate.service';
import { ParseVotesService } from '../parse-votes.service';
import { VoteChartsComponent} from '../vote-charts/vote-charts.component';
import { Router, ActivatedRoute } from '@angular/router'; 


@Component({
  selector: 'app-votes-table',
  templateUrl: './votes-table.component.html',
  styleUrls: ['./votes-table.component.css']
})
export class VotesTableComponent implements OnDestroy, OnInit {
  
  @ViewChild(VoteChartsComponent) voteCharts: VoteChartsComponent;
  @ViewChild(DataTableDirective, { static: false }) dataTableElement: DataTableDirective;
  //@ViewChild('mytable') tableRef: ElementRef;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  dtInstance: DataTables.Api;

  thePresVotes: any[];
  theVotes: any[];
  @Output() selected_index:number = 0;
  @Output() parse_interval:number = 10;
    
  @Input() selected_sort:string;
  @Input() state_selected:string;
    
  constructor(private getState: GetstateService, private parseVotes: ParseVotesService, private elementRef: ElementRef, private router: Router) { }

  raceData : RaceInfo;
  theRaceId:string;  
  headers : string[];

  tlheaders: string[] = ["Biden Votes","Biden Vote Increase","1st Index","2nd Index", "Other Votes","Time1","Time2","1st Trump Votes","2nd Trump Votes",
              "Trump Vote Loss","Accumulated Trump Vote Loss","Votes Increase + Trump Loss","Last Vote Total", "Overall Vote Increase"];

  blheaders: string[] = ["Trump Votes","Trump Vote Increase","1st Index","2nd Index", "Other Votes","1st Biden Votes","2nd Biden Votes",
              "Biden Vote Loss","Accumulated Biden Vote Loss","Votes Increase + Biden Loss","Last Vote Total", "Overall Vote Increase"]; 
  states: string[] = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho",
              "Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota",
              "Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina",
              "North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee",
              "Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]; 
  sorts:string[] = ["Time Stamps","Cumulative Vote Totals"]; 

  header: string;
  cell: string;
  item: string;
  biden_slices: any[];
  trump_slices: any[];
  other_slices: any[];
  total_slices: any[];
  dateheaders_store: any[];
  datedatabiden_store: any[];
  datedatabidenadd_store: any[];
  datedatabidenadddiff_store: any[];
  datedatatrump_store: any[];
  datedatatrumpadd_store: any[];
  datedatatrumpadddiff_store: any[];
  datedataother_store: any[];
  datedataotheradd_store: any[];
  datedatatotaladd_store: any[];
  datedatatotal_store: any[];
  perremainingtrump_store: any[];
  perremainingbiden_store: any[];
  pie_headers: any[];
  presVotes: any[];
  number_pages:number;
  loading:boolean = false;

  pselected:string;
  vote_rows: any[];
  state:string;

  resolutions:string[] = ['1 Time','5 Times','10 Times','15 Times'];


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




setResolution():void{ 
  this.parse_interval = parseInt(this.pselected.replace('Times',''));
  this.voteCharts.votesLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
  this.voteCharts.spikesLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
  this.voteCharts.diffLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
  this.voteCharts.perLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
  this.voteCharts.pieChart(this.thePresVotes,this.parse_interval,this.selected_index); 
  this.voteCharts.stackedBarChart(this.thePresVotes,this.parse_interval,this.selected_index); 
  this.getPageInfo().subscribe((res:any) => {
    console.log("Should be Page Info:", res.page.info());
    this.selected_index = res.page.info().page+1;
    this.number_pages = res.page.info().pages;
    this.voteCharts.fill_votebins(this.number_pages);
    this.voteCharts.stackedBarChart2(this.thePresVotes,this.parse_interval,this.selected_index);    
  });
}

  
  render_table(votes):void{    
   
      // Calling the DT trigger to manually render the table      
      this.dtTrigger.next(); 
      this.voteCharts.votesLineChart(votes,this.parse_interval,this.selected_index);
      this.voteCharts.spikesLineChart(votes,this.parse_interval,this.selected_index);
      this.voteCharts.diffLineChart(votes,this.parse_interval,this.selected_index);
      this.voteCharts.perLineChart(votes,this.parse_interval,this.selected_index); 
      this.voteCharts.pieChart(votes,this.parse_interval,this.selected_index); 
      this.voteCharts.stackedBarChart(votes,this.parse_interval,this.selected_index);
     
      this.getPageInfo().subscribe((res:any) => {
        console.log("Should be Page Info:", res.page.info());
        this.selected_index = res.page.info().page+1;
        this.number_pages = res.page.info().pages;
        this.voteCharts.fill_votebins(this.number_pages); 
        this.voteCharts.stackedBarChart2(votes,this.parse_interval,this.selected_index); 
        
      });

  }

  rerender(votes,state): void {  
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      stateSave:false
    };
   
        
    this.dataTableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();      
      this.dtTrigger.next(); 
      
      this.thePresVotes = votes; 
      this.getPageInfo().subscribe((res:any) => {
        this.selected_index = res.page.info().page;
        this.voteCharts.votesLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
        this.voteCharts.spikesLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
        this.voteCharts.diffLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
        this.voteCharts.perLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
        this.voteCharts.pieChart(this.thePresVotes,this.parse_interval,this.selected_index);
        this.voteCharts.stackedBarChart(this.thePresVotes,this.parse_interval,this.selected_index);
        this.getPageInfo().subscribe((res:any) => {
          this.selected_index = res.page.info().page;        
          this.number_pages = res.page.info().pages;
          this.voteCharts.fill_votebins(this.number_pages);
          this.voteCharts.stackedBarChart2(this.thePresVotes,this.parse_interval,this.selected_index);
        });  
      });        
      
    });
  }

  // Convert Promise into Observable
  getPageInfo():any{   
    return from(this.dataTableElement.dtInstance.then((dtInstance: DataTables.Api) => dtInstance)).pipe(map((res) => res));
  }


  ngOnInit(): void {
   
      this.pselected = '5 Times';
      this.selected_index = 1;
      
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
        stateSave:false,
           
        drawCallback: () => {        
            this.elementRef.nativeElement.querySelector("a[class^='paginate_button'][class$='next']")        
              .addEventListener('click', this.onClick.bind(this));
            this.elementRef.nativeElement.querySelector('.paginate_button.previous')        
              .addEventListener('click', this.onClick.bind(this));  
            this.elementRef.nativeElement.querySelector('.paginate_button.last')        
              .addEventListener('click', this.onLast.bind(this));  
            this.elementRef.nativeElement.querySelector('.paginate_button.first')        
              .addEventListener('click', this.onFirst.bind(this));   
            this.elementRef.nativeElement.querySelector('.paginate_button.current')        
              .addEventListener('click', this.onButton.bind(this)); 
          }
      };   
    
      this.raceData = {
        "raceId": "",
        "raceSlug":"", 
        "raceUrl":""
      };
     // this.get_votes('initial');
     const voterRows$ = this.getState.get_state(this.state_selected).pipe(this.getVotes);
     voterRows$.subscribe((res:any) => {   
        this.thePresVotes = res; 
        this.dtTrigger.next();  
        this.getPageInfo().subscribe((res:any) => {
          this.selected_index = res.page.info().page;
          this.voteCharts.votesLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
          this.voteCharts.spikesLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
          this.voteCharts.diffLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
          this.voteCharts.perLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
          this.voteCharts.pieChart(this.thePresVotes,this.parse_interval,this.selected_index);
          this.voteCharts.stackedBarChart(this.thePresVotes,this.parse_interval,this.selected_index);
          this.getPageInfo().subscribe((res:any) => {
            this.selected_index = res.page.info().page;        
            this.number_pages = res.page.info().pages;
            this.voteCharts.fill_votebins(this.number_pages);
            this.voteCharts.stackedBarChart2(this.thePresVotes,this.parse_interval,this.selected_index);
          });   
       });  
      });    
     


     
    
    this.state = 'michigan';
    this.parse_interval = 5;
    this.headers  = ["Index","Biden %","Biden Votes","Trump %","Trump Votes","Other Votes","Time Stamps","Votes", "Votes Added","Trump Added","Biden Added","% of Remaining Biden","% of Remaining Trump"];
    console.log("Headers: ",this.headers);   
  }

       
  ngAfterViewInit():void {      
 
  }
  

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  onClick(): void {
    this.getPageInfo().subscribe((res:any) => {
      console.log("Should be Page Info:", res.page.info());
      this.selected_index = res.page.info().page+1;
      this.number_pages = res.page.info().pages;
      this.voteCharts.votesLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.spikesLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.diffLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.perLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.pieChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.stackedBarChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.getPageInfo().subscribe((res:any) => {
        this.selected_index = res.page.info().page+1;
        this.number_pages = res.page.info().pages;
        this.voteCharts.fill_votebins(this.number_pages);
        this.voteCharts.stackedBarChart2(this.thePresVotes,this.parse_interval,this.selected_index);
      }); 
    });  
  }
   
   onLast(): void {
    this.getPageInfo().subscribe((res:any) => {
      this.selected_index = res.page.info().pages-1;
      this.voteCharts.votesLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.spikesLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.diffLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.perLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.pieChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.stackedBarChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.getPageInfo().subscribe((res:any) => {
        this.selected_index = res.page.info().pages-1;        
        this.number_pages = res.page.info().pages;
        this.voteCharts.fill_votebins(this.number_pages);
        this.voteCharts.stackedBarChart2(this.thePresVotes,this.parse_interval,this.selected_index);
      });   
   });  
  }

  onButton(): void {
    console.log("Gets Here!");
    this.getPageInfo().subscribe((res:any) => {
      this.selected_index = res.page.info().page;
      this.voteCharts.votesLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.spikesLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.diffLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.perLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.pieChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.stackedBarChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.getPageInfo().subscribe((res:any) => {
        this.selected_index = res.page.info().page;        
        this.number_pages = res.page.info().pages;
        this.voteCharts.fill_votebins(this.number_pages);
        this.voteCharts.stackedBarChart2(this.thePresVotes,this.parse_interval,this.selected_index);
      });   
   });  
  }


  onFirst(): void {
  
      this.selected_index = 0;
      this.voteCharts.votesLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.spikesLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.diffLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.perLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.pieChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.stackedBarChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.getPageInfo().subscribe((res:any) => {
        this.selected_index = 0;        
        this.number_pages = res.page.info().pages;
        this.voteCharts.fill_votebins(this.number_pages);
        this.voteCharts.stackedBarChart2(this.thePresVotes,this.parse_interval,this.selected_index);
      });  
  }


}
