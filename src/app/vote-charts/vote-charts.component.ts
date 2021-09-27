import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, Injectable} from '@angular/core';
import { Chart , getContext} from 'chart.js';
import { GetPageinfoService} from '../get-pageinfo.service';
import { ParseVotesService} from '../parse-votes.service';


@Component({
  selector: 'app-vote-charts',
  templateUrl: './vote-charts.component.html',
  styleUrls: ['./vote-charts.component.css']
})
export class VoteChartsComponent implements OnInit {

 
  vote_bins:any[];
 
  bin_headers:any[];
  bin_biden:any[];
  bin_trump:any[];

  biden_slices:any[];
  trump_slices:any[];
  other_slices:any[];
  total_slices:any[];

  
  thePresVotes: any[];
  @Input() parse_interval:number;
  selected_index:number;

  date_headers:any[];
  dateheaders_store:any[];
  datedata_biden:any[];
  datedatabiden_store:any[];
  datedatabidenadd_store:any[];
  datedatabidenadddiff_store:any[];

  datedata_trump:any[];
  datedatatrump_store:any[];
  datedatatrumpadd_store:any[];
  datedatatrumpadddiff_store:any[];

  datedata_other:any[];
  datedataother_store:any[];
  datedataotheradd_store:any[];
  datedatatotal_store:any[];
  datedatatotaladd_store:any[];

  datedata_biden_add:any[];
  datedata_trump_add:any[];
  datedata_total_add:any[];
  datedata_other_add:any[];

  datedata_biden_diff_add:any[];
  datedata_trump_diff_add:any[];

  
  perremainingtrump_store:any[];
  perremainingbiden_store:any[];
  the_pieheader:string;
  pie_headers:any[];


  @ViewChild('votesLineChart', {static:false}) votesLineCanvas: ElementRef;
  @ViewChild('spikesLineChart', {static:false}) spikesLineCanvas: ElementRef;
  @ViewChild('diffLineChart', {static:false}) diffLineCanvas: ElementRef;
  @ViewChild('perLineChart', {static:false}) perLineCanvas: ElementRef;
  @ViewChild('pieChart', {static:false}) pieChartCanvas: ElementRef;
  @ViewChild('stackedChart', {static:false}) stackedChartCanvas: ElementRef;
  @ViewChild('binStackedChart', {static:false}) binStackedChartCanvas: ElementRef;

  public context: CanvasRenderingContext2D;
  myLineChart:any;
  myLineChart2:any;
  myLineChart3:any;
  myLineChart4:any;
  myPieChart:any;
  myStackedChart:any;
  myStackedChart2:any;



  constructor(private parseVotesService:ParseVotesService) { }


  fill_votebins(number_pages):void {

    // Set up Vote Bins
    var index = 0;
    var interval = 0;
    var vote_bin = {
        "interval":0,
        "biden_in_bin": 0,
        "trump_in_bin":0,
    };
  
   console.log("Number of Pages: ", number_pages);
   let step = 200000/(number_pages*10);
    //var step = 2500;
    
    console.log("Step",step);

    while(interval <= 200000){
        vote_bin.interval = interval;
        vote_bin.trump_in_bin = 0;
        vote_bin.biden_in_bin = 0;
        this.vote_bins[index] = vote_bin;
        //console.log("Vote Bins: ",this.vote_bins[index]);
        index++;
        interval = interval + step;
        
        var vote_bin = {
            "interval":0,
            "biden_in_bin": 0,
            "trump_in_bin":0,
        };

    }
   


    // Put in Biden Bins
    for(var j = 0;j<this.datedatabidenadddiff_store.length;j++){
        var store = this.datedatabidenadddiff_store[j];
        for(var k=0;k < store.length;k++){
            for(var l = 0;l < this.vote_bins.length;l++){
                //console.log("Store value:",store[k]);
                if(l > 0)
                    if(store[k] < this.vote_bins[l].interval && store[k] >= this.vote_bins[l-1].interval)
                        this.vote_bins[l].biden_in_bin++;
            }
        }
        //console.log("Store:",store);
    }

    // Put in Trump Bins
    for(var j = 0;j<this.datedatatrumpadddiff_store.length;j++){
        var store = this.datedatatrumpadddiff_store[j];
        for(var k=0;k < store.length;k++){
            for(var l = 0;l < this.vote_bins.length;l++){
                //console.log("Store value:",store[k]);
                if(l > 0)
                    if(store[k] < this.vote_bins[l].interval && store[k] >= this.vote_bins[l-1].interval)
                        this.vote_bins[l].trump_in_bin++;
            }
        }
        //console.log("Store:",store);
    }
    console.log("Vote Bins: ",this.vote_bins);

    this.bin_headers = [];
    this.bin_biden = [];
    this.bin_trump = [];
    // Just for update

    var index = 0;
    for(let i=0;i<this.vote_bins.length;i++){
            if(i == 0){
                this.bin_headers[index] = [];
                this.bin_biden[index] = [];
                this.bin_trump[index] = [];
                this.bin_headers[index].push(this.vote_bins[i].interval);
                this.bin_biden[index].push(this.vote_bins[i].biden_in_bin);
                this.bin_trump[index].push(this.vote_bins[i].trump_in_bin);
                
            }
            else if( i % this.parse_interval != 0 ){
                this.bin_headers[index].push(this.vote_bins[i].interval);
                this.bin_biden[index].push(this.vote_bins[i].biden_in_bin);
                this.bin_trump[index].push(this.vote_bins[i].trump_in_bin);
            }
            else if(i % this.parse_interval == 0) {
                this.bin_headers[index].push(this.vote_bins[i].interval);
                this.bin_biden[index].push(this.vote_bins[i].biden_in_bin);
                this.bin_trump[index].push(this.vote_bins[i].trump_in_bin);
                
                index++;     
                this.bin_headers[index] = [];
                this.bin_biden[index] = [];
                this.bin_trump[index] = [];     
            }
            else{
                this.bin_headers[index].push(this.vote_bins[i].interval);
                this.bin_biden[index].push(this.vote_bins[i].biden_in_bin);
                this.bin_trump[index].push(this.vote_bins[i].trump_in_bin);
            }

        }
    
  }

 // Function used to Display Line Chart based on ChartFx Jquery Plugin
votesLineChart(votes,parse_interval,selected_index):void{
   
    this.loadData(votes,parse_interval);
    this.date_headers = this.dateheaders_store[selected_index];
    this.datedata_biden = this.datedatabiden_store[selected_index];
    this.datedata_trump = this.datedatatrump_store[selected_index];
    this.datedata_other = this.datedataother_store[selected_index];
        
    let context = this.votesLineCanvas.nativeElement.getContext('2d');
    // Global Options:
    Chart.defaults.global.defaultFontColor = 'black';
    Chart.defaults.global.defaultFontSize = 12;

    var data = {
      labels: this.date_headers,
      datasets: [{
          label: "Trump Votes",
          fill: true,
          lineTension: 0.1,
          backgroundColor: "rgba(167,105,0,0.4)",
          borderColor: "rgb(167, 105, 0)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "white",
          pointBackgroundColor: "black",
          pointBorderWidth: 1,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: "brown",
          pointHoverBorderColor: "yellow",
          pointHoverBorderWidth: 2,
          pointRadius: 4,
          pointHitRadius: 10,
          // notice the gap in the data and the spanGaps: false
          data: this.datedata_trump,
          spanGaps: false,
          },{
          label: "Biden Votes",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(225,0,0,0.4)",
          borderColor: "red", // The main line color
          borderCapStyle: 'square',
          borderDash: [], // try [5, 15] for instance
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "black",
          pointBackgroundColor: "white",
          pointBorderWidth: 1,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: "yellow",
          pointHoverBorderColor: "brown",
          pointHoverBorderWidth: 2,
          pointRadius: 4,
          pointHitRadius: 10,
          // notice the gap in the data and the spanGaps: true
          data: this.datedata_biden,
          spanGaps: true,
          }, {
          label: "Other Votes",
          fill: true,
          lineTension: 0.1,
          backgroundColor: "rgba(86,105,0,0.4)",
          borderColor: "rgb(86, 105, 0)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "white",
          pointBackgroundColor: "black",
          pointBorderWidth: 1,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: "brown",
          pointHoverBorderColor: "yellow",
          pointHoverBorderWidth: 2,
          pointRadius: 4,
          pointHitRadius: 10,
          // notice the gap in the data and the spanGaps: false
          data: this.datedata_other,
          spanGaps: false,
        }

      ]
    };

    // Notice the scaleLabel at the same level as Ticks
    var options = {
        responsive:true,
        scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        },                   
                        scaleLabel: {
                            display: true,
                            labelString: 'Vote Totals',
                            fontSize: 20 
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            autoSkip: false,
                            maxRotation: 90,
                            minRotation: 90
                        }
                    }]        
                } ,
                
    };

    if(this.myLineChart){
        this.myLineChart.destroy();
    }
    // Chart declaration:
    this.myLineChart = new Chart(context, {
        type: 'line',
        data: data,
        options: options
        });
  }

// Function used to Display Line Chart based on ChartFx Jquery Plugin
spikesLineChart(votes,parse_interval,selected_index):void{
   
    this.loadData(votes,parse_interval);
    this.date_headers = this.dateheaders_store[selected_index];
    this.datedata_biden_add = this.datedatabidenadd_store[selected_index];
    this.datedata_trump_add = this.datedatatrumpadd_store[selected_index];
    this.datedata_other_add = this.datedataotheradd_store[selected_index];
    this.datedata_total_add = this.datedatatotaladd_store[selected_index];
    
    let context = this.spikesLineCanvas.nativeElement.getContext('2d');

    // Global Options:
    Chart.defaults.global.defaultFontColor = 'black';
    Chart.defaults.global.defaultFontSize = 12;

    var data = {
      labels: this.date_headers,
      datasets: [{
          label: "Trump Spike",
          fill: true,
          lineTension: 0.1,
          backgroundColor: "rgba(167,105,0,0.4)",
          borderColor: "rgb(167, 105, 0)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "white",
          pointBackgroundColor: "black",
          pointBorderWidth: 1,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: "brown",
          pointHoverBorderColor: "yellow",
          pointHoverBorderWidth: 2,
          pointRadius: 4,
          pointHitRadius: 10,
          // notice the gap in the data and the spanGaps: false
          data: this.datedata_trump_add,
          spanGaps: false,
          },{
          label: "Biden Spike",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(225,0,0,0.4)",
          borderColor: "red", // The main line color
          borderCapStyle: 'square',
          borderDash: [], // try [5, 15] for instance
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "black",
          pointBackgroundColor: "white",
          pointBorderWidth: 1,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: "yellow",
          pointHoverBorderColor: "brown",
          pointHoverBorderWidth: 2,
          pointRadius: 4,
          pointHitRadius: 10,
          // notice the gap in the data and the spanGaps: true
          data: this.datedata_biden_add,
          spanGaps: true,
          }, {
          label: "Other Spike",
          fill: true,
          lineTension: 0.1,
          backgroundColor: "rgba(86,105,0,0.4)",
          borderColor: "rgb(86, 105, 0)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "white",
          pointBackgroundColor: "black",
          pointBorderWidth: 1,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: "brown",
          pointHoverBorderColor: "yellow",
          pointHoverBorderWidth: 2,
          pointRadius: 4,
          pointHitRadius: 10,
          // notice the gap in the data and the spanGaps: false
          data: this.datedata_other,
          spanGaps: false,
        },{
            label: "Total Spike",
            fill: true,
            lineTension: 0.1,
            backgroundColor: "lightblue",
            borderColor: "blue",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "white",
            pointBackgroundColor: "black",
            pointBorderWidth: 1,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: "brown",
            pointHoverBorderColor: "yellow",
            pointHoverBorderWidth: 2,
            pointRadius: 4,
            pointHitRadius: 10,
            // notice the gap in the data and the spanGaps: false
            data: this.datedata_total_add,
            spanGaps: false,
            }
      ]
    };

    // Notice the scaleLabel at the same level as Ticks
    var options = {
    scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'New Vote Totals',
                        fontSize: 20 
                    }
                }],
                xAxes: [{
                    ticks: {
                        autoSkip: false,
                        maxRotation: 90,
                        minRotation: 90
                    }
                }]                    
            }  
    };

    if(this.myLineChart2){
        this.myLineChart2.destroy();
    }
    // Chart declaration:
    this.myLineChart2 = new Chart(context, {
        type: 'line',
        data: data,
        options: options
        });
  }


  diffLineChart(votes,parse_interval,selected_index):void{
    this.loadData(votes,parse_interval);  
    this.date_headers = this.dateheaders_store[selected_index];
    this.datedata_biden_diff_add = this.datedatabidenadddiff_store[selected_index];
    this.datedata_trump_diff_add = this.datedatatrumpadddiff_store[selected_index];

    let context = this.diffLineCanvas.nativeElement.getContext('2d');
    // Global Options:
    Chart.defaults.global.defaultFontColor = 'black';
    Chart.defaults.global.defaultFontSize = 12;

    var data = {
    labels: this.date_headers,
    datasets: [{
        label: "Trump Gain/Loss",
        fill: true,
        lineTension: 0.1,
        backgroundColor: "rgba(167,105,0,0.4)",
        borderColor: "rgb(167, 105, 0)",
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: "white",
        pointBackgroundColor: "black",
        pointBorderWidth: 1,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: "brown",
        pointHoverBorderColor: "yellow",
        pointHoverBorderWidth: 2,
        pointRadius: 4,
        pointHitRadius: 10,
        // notice the gap in the data and the spanGaps: false
        data: this.datedata_trump_diff_add,
        spanGaps: false,
        },{
        label: "Biden Gain/Loss",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(225,0,0,0.4)",
        borderColor: "red", // The main line color
        borderCapStyle: 'square',
        borderDash: [], // try [5, 15] for instance
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: "black",
        pointBackgroundColor: "white",
        pointBorderWidth: 1,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: "yellow",
        pointHoverBorderColor: "brown",
        pointHoverBorderWidth: 2,
        pointRadius: 4,
        pointHitRadius: 10,
        // notice the gap in the data and the spanGaps: true
        data: this.datedata_biden_diff_add,
        spanGaps: true,
        }
    ]
    };

    // Notice the scaleLabel at the same level as Ticks
    var options = {
    scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Votes Gain/Loss',
                        fontSize: 20 
                    }
                }],
                xAxes: [{
                    ticks: {
                        autoSkip: false,
                        maxRotation: 90,
                        minRotation: 90
                    }
                }]                    
            }  
    };

    if(this.myLineChart3){
        this.myLineChart3.destroy();
    }
    // Chart declaration:
    this.myLineChart3 = new Chart(context, {
        type: 'line',
        data: data,
        options: options
        });
}


perLineChart(votes,parse_interval,selected_index):void{
    this.loadData(votes,parse_interval);
    this.date_headers = this.dateheaders_store[selected_index];
    var pertrump = this.perremainingtrump_store[selected_index];
    var perbiden = this.perremainingbiden_store[selected_index];

    let context = this.perLineCanvas.nativeElement.getContext('2d');

    // Global Options:
    Chart.defaults.global.defaultFontColor = 'black';
    Chart.defaults.global.defaultFontSize = 12;

    var data = {
    labels: this.date_headers,
    datasets: [{
        label: "Trump % of Remaining Vote",
        fill: true,
        lineTension: 0.1,
        backgroundColor: "rgba(167,105,0,0.4)",
        borderColor: "rgb(167, 105, 0)",
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: "white",
        pointBackgroundColor: "black",
        pointBorderWidth: 1,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: "brown",
        pointHoverBorderColor: "yellow",
        pointHoverBorderWidth: 2,
        pointRadius: 4,
        pointHitRadius: 10,
        // notice the gap in the data and the spanGaps: false
        data: pertrump,
        spanGaps: false,
        },{
        label: "Biden % of Remaining Vote",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(225,0,0,0.4)",
        borderColor: "red", // The main line color
        borderCapStyle: 'square',
        borderDash: [], // try [5, 15] for instance
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: "black",
        pointBackgroundColor: "white",
        pointBorderWidth: 1,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: "yellow",
        pointHoverBorderColor: "brown",
        pointHoverBorderWidth: 2,
        pointRadius: 4,
        pointHitRadius: 10,
        // notice the gap in the data and the spanGaps: true
        data: perbiden,
        spanGaps: true,
        }
    ]
    };

    // Notice the scaleLabel at the same level as Ticks
    var options = {
    scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Percent of Remaining Votes',
                        fontSize: 20 
                    }
                }],
                xAxes: [{
                    ticks: {
                        autoSkip: false,
                        maxRotation: 90,
                        minRotation: 90
                    }
                }]                    
            }  
    };

    if(this.myLineChart4){
        this.myLineChart4.destroy();
    }
    // Chart declaration:
    this.myLineChart4 = new Chart(context, {
        type: 'line',
        data: data,
        options: options
        });
}


pieChart(votes,parse_interval,selected_index): void{
    this.loadData(votes,parse_interval);
    let context = this.pieChartCanvas.nativeElement.getContext('2d');

    Chart.defaults.global.defaultFontFamily = "Lato";
    Chart.defaults.global.defaultFontSize = 18;

    this.the_pieheader = this.pie_headers[selected_index]; 
    console.log("Pie Header: ",this.the_pieheader);

    var oilData = {
        labels: [
            "Trump Votes",
            "Biden Votes",
            "Other Votes"
        ],
        datasets: [
            {
                data: [this.trump_slices[selected_index], this.biden_slices[selected_index],this.other_slices[selected_index]],
                backgroundColor: [
                    "rgba(167,105,0,0.4)",
                    "red",
                    "rgba(86,105,0,0.4)"
                ],
                borderColor:[
                    "rgb(167, 105, 0)",
                    "red",
                    "rgb(86, 105, 0)"

                ]
            }]
    };

    if(this.myPieChart){
        this.myPieChart.destroy();
    }

    this.myPieChart = new Chart(context, {
    type: 'pie',
    data: oilData
    });
}

stackedBarChart(votes,parse_interval,selected_index): void{
    this.loadData(votes,parse_interval);
    this.date_headers = this.dateheaders_store[selected_index];
    this.datedata_biden = this.datedatabiden_store[selected_index];
    this.datedata_trump = this.datedatatrump_store[selected_index];
    this.datedata_other = this.datedataother_store[selected_index];

    console.log("Date Data Biden: ", this.datedata_biden);

    let context = this.stackedChartCanvas.nativeElement.getContext('2d');
    
    if(this.myStackedChart){
        this.myStackedChart.destroy();
    }
    this.myStackedChart = new Chart(context, {
        type: 'bar',
        data: {
            labels:  this.date_headers,
            datasets: [{
            type: 'bar',
            label: 'Trump Votes',
            backgroundColor: "rgba(167,105,0,0.4)",
            borderColor: "rgb(167, 105, 0)",
            stack: 'Stack 0',
            borderWidth: 2,
            data: this.datedata_trump
            }, {
            type: 'bar',
            label: 'Biden Votes',
            backgroundColor: "red",
            borderColor:"red",
            stack: 'Stack 0',
            data: this.datedata_biden,
            borderWidth: 2
            }, {
            type: 'bar',
            label: 'Other Votes',
            backgroundColor: "rgba(86,105,0,0.4)",
            borderColor:"rgb(86, 105, 0)",
            stack: 'Stack 0',
            data: this.datedata_other
            }]
        },
        options: {
            responsive: true,
            title: {
            display: true,
            text: 'Vote Totals Per Time Interval'
            },
            tooltips: {
            mode: 'index',
            intersect: true
            },
            scales: {
            xAxes: [{
                stacked: true,
            }]
            }
        }
    });
}


stackedBarChart2(votes,parse_interval,selected_index):void{
    let context = this.binStackedChartCanvas.nativeElement.getContext('2d');
        
    if(this.myStackedChart2){
        this.myStackedChart2.destroy();
    }
    this.myStackedChart2 = new Chart(context, {
        type: 'bar',
        data: {
            labels: this.bin_headers[selected_index],
            datasets: [{
            type: 'bar',
            label: 'Number for Trump',
            backgroundColor: "rgba(167,105,0,0.4)",
            borderColor: "rgb(167, 105, 0)",
            stack: 'Stack 0',
            borderWidth: 2,
            data: this.bin_trump[selected_index]
            }, {
            type: 'bar',
            label: 'Number for Biden',
            backgroundColor: "red",
            borderColor:"red",
            stack: 'Stack 0',
            data: this.bin_biden[selected_index],
            borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            title: {
            display: true,
            text: 'Number of Gains within Gain Size Interval'
            },
            tooltips: {
            mode: 'index',
            intersect: true
            },
            scales: {
            xAxes: [{
                stacked: true,
            }]
            }
        }
    });
}




  loadData(thePresVotes,parse_interval):void{
    let parsedVotes = this.parseVotesService.parse_vote(thePresVotes,parse_interval);
    console.log("Parsed Votes: ",parsedVotes);
    this.biden_slices = parsedVotes.bidenSlices;
    this.datedatabidenadddiff_store = parsedVotes.dateDataBidenAddDiffStore;
    this.datedatabidenadd_store = parsedVotes.dateDataBidenAddStore;
    this.datedatabiden_store = parsedVotes.dateDataBidenStore;
    this.datedataotheradd_store = parsedVotes.dateDataOtherAddStore;
    this.datedataother_store = parsedVotes.dateDataOtherStore;
    this.datedatatotaladd_store = parsedVotes.dateDataTotalAddStore;
    this.datedatatotal_store = parsedVotes.dateDataTotalStore;
    this.datedatatrumpadddiff_store = parsedVotes.dateDataTrumpAddDiffStore;    
    this.datedatatrumpadd_store = parsedVotes.dateDataTrumpAddStore;
    this.datedatatrump_store = parsedVotes.dateDataTrumpStore;
    this.dateheaders_store = parsedVotes.dateHeadersStore;
    this.other_slices = parsedVotes.otherSlices;
    this.perremainingbiden_store = parsedVotes.perRemainingBidenStore;
    this.perremainingtrump_store = parsedVotes.perRemainingTrumpStore;
    this.pie_headers = parsedVotes.pieHeaders;
    this.total_slices = parsedVotes.totalSlices;
    this.trump_slices = parsedVotes.trumpSlices;
    
  }

  ngOnInit(): void {    
      
    this.vote_bins = [];
   // $(document).ready(function(){
     //   $('[data-toggle="tooltip"]');
   //   });
    
  }


}