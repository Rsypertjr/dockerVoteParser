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
  
  @ViewChild(VoteChartsComponent, {static: false}) voteCharts: VoteChartsComponent;
  @ViewChild(DataTableDirective, {static: false }) dataTableElement: DataTableDirective;
  //@ViewChild('mytable') tableRef: ElementRef;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  dtInstance: DataTables.Api;
  vm:any;

  @Input() thePresVotes: any[];
  theVotes: any[];
  @Output() selected_index:number;
  @Output() parse_interval:number;
 
    
  constructor(private getState: GetstateService, private parseVotes: ParseVotesService, private elementRef: ElementRef, private router: Router) { }
 
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
    this.selected_index = res.page.info().page;
    this.number_pages = res.page.info().pages;
    this.voteCharts.fill_votebins(this.number_pages);
    this.voteCharts.stackedBarChart2(this.thePresVotes,this.parse_interval,this.selected_index);    
  });
}

  
  render_table():void{       
    this.dtTrigger.next();  
        
  }

  drawCharts(votes):void{

    this.voteCharts.votesLineChart(votes,this.parse_interval,this.selected_index);
    this.voteCharts.spikesLineChart(votes,this.parse_interval,this.selected_index);
    this.voteCharts.diffLineChart(votes,this.parse_interval,this.selected_index);
    this.voteCharts.perLineChart(votes,this.parse_interval,this.selected_index);
    this.voteCharts.pieChart(votes,this.parse_interval,this.selected_index);
    this.voteCharts.stackedBarChart(votes,this.parse_interval,this.selected_index);
    this.getPageInfo().subscribe((res:any) => {
      this.selected_index = res.page.info().page;
      let parse_int = this.parse_interval;
      this.number_pages = res.page.info().pages;
      this.voteCharts.fill_votebins(this.number_pages);
      this.voteCharts.stackedBarChart2(votes,parse_int,this.selected_index);
    });

  }

 
  rerender(votes): void {    
      let selected_indx = this.selected_index;
      let parse_int = this.parse_interval;
      this.dataTableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
        this.voteCharts.votesLineChart(votes,parse_int,selected_indx);
        this.voteCharts.spikesLineChart(votes,parse_int,selected_indx);
        this.voteCharts.diffLineChart(votes,parse_int,selected_indx);
        this.voteCharts.perLineChart(votes,parse_int,selected_indx);
        this.voteCharts.pieChart(votes,parse_int,selected_indx);
        this.voteCharts.stackedBarChart(votes,parse_int,selected_indx);
        this.getPageInfo().subscribe((res:any) => {
          this.selected_index = res.page.info().page;
          this.number_pages = res.page.info().pages;
          this.voteCharts.fill_votebins(this.number_pages);
          this.voteCharts.stackedBarChart2(votes,parse_int,this.selected_index);
        });
        this.elementRef.nativeElement.querySelector('.paginate_button.next')        
        .addEventListener('click', this.onClick.bind(this));
        this.elementRef.nativeElement.querySelector('.paginate_button.previous')        
          .addEventListener('click', this.onClick.bind(this));  
        this.elementRef.nativeElement.querySelector('.paginate_button.last')        
          .addEventListener('click', this.onLast.bind(this));  
        this.elementRef.nativeElement.querySelector('.paginate_button.first')        
          .addEventListener('click', this.onFirst.bind(this));   
        this.elementRef.nativeElement.querySelector('.paginate_button.current')        
          .addEventListener('click', this.onButton.bind(this));           

      });
    
  }

  // Convert Promise into Observable
  getPageInfo():any{   
    return from(this.dataTableElement.dtInstance.then((dtInstance: DataTables.Api) => dtInstance)).pipe(map((res) => res));
  }

  callback(json):void {
      console.log(json);
  }
 

  ngOnInit(): void {
   
      this.pselected = '5 Times';
      this.parse_interval = 5;
      this.selected_index = 1;
      this.state = 'Alabama';
      this.headers  = ["Index","Biden %","Biden Votes","Trump %","Trump Votes","Other Votes","Time Stamps","Votes", "Votes Added","Trump Added","Biden Added","% of Remaining Biden","% of Remaining Trump"];
      console.log("Headers: ",this.headers);   
     
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
        stateSave:false,
        responsive:true,
           
        drawCallback: () => {        
            this.elementRef.nativeElement.querySelector('.paginate_button.next')        
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
      this.voteCharts.fill_votebins(this.number_pages);
      this.voteCharts.stackedBarChart2(this.thePresVotes,this.parse_interval,this.selected_index);    
    });  
  }
   
   onLast(): void {
    this.getPageInfo().subscribe((res:any) => {
      this.selected_index = res.page.info().pages-1;
      this.number_pages = res.page.info().pages;
      this.voteCharts.votesLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.spikesLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.diffLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.perLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.pieChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.stackedBarChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.fill_votebins(this.number_pages);
      this.voteCharts.stackedBarChart2(this.thePresVotes,this.parse_interval,this.selected_index);     
   });  
  }

  onButton(): void {
    console.log("Gets Here!");
    this.getPageInfo().subscribe((res:any) => {
      this.selected_index = res.page.info().page;
      this.number_pages = res.page.info().pages;
      this.voteCharts.votesLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.spikesLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.diffLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.perLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.pieChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.stackedBarChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.fill_votebins(this.number_pages);
      this.voteCharts.stackedBarChart2(this.thePresVotes,this.parse_interval,this.selected_index);    
   });  
  }


  onFirst(): void {
    this.getPageInfo().subscribe((res:any) => {
      this.selected_index = 0;
      this.number_pages = res.page.info().pages;
      this.voteCharts.votesLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.spikesLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.diffLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.perLineChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.pieChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.stackedBarChart(this.thePresVotes,this.parse_interval,this.selected_index);
      this.voteCharts.fill_votebins(this.number_pages);
      this.voteCharts.stackedBarChart2(this.thePresVotes,this.parse_interval,this.selected_index);    
    });
  }


}
