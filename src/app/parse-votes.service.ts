import { Injectable,  } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParseVotesService {

  constructor() { }

  parse_vote(vote_rows, parse_interval=10):any{
    // Derive Headers and Data for Line Chart
     
      var dateheaders = [];
      var datedatabiden = [];
      var datedatabidenadd = [];
      var datedatabidenadddiff = [];
      var datedatatrump = [];
      var datedatatrumpadd = [];
      var datedatatrumpadddiff = [];
      var datedatatotal = [];
      var datedatatotaladd = [];
      var datedataother = [];
      var datedataotheradd = [];
      var perremainingtrump = [];
      var perremainingbiden = [];
  
      var dateheaders_store = [];
      var datedatabiden_store = [];
      var datedatabidenadd_store = [];
      var datedatabidenadddiff_store = [];
      var datedatatrump_store = [];
      var datedatatrumpadd_store = [];
      var datedatatrumpadddiff_store = [];
      var datedatatotal_store = [];
      var datedataother_store = [];
      var datedataotheradd_store = [];
      var datedatatotaladd_store = [];
      var perremainingtrump_store = [];
      var perremainingbiden_store = [];
  
      var totalslices = [];
      var bidenslices = [];
      var trumpslices = [];
      var otherslices = [];
      var pieheaders = [];
  
  
      console.log("Parse Interval",parse_interval);
      for(i=0;i<vote_rows.length;i++){
          if(i == 0){
              dateheaders.push(vote_rows[i].timestamp);
              datedatabiden.push(vote_rows[i].biden_votes);
              datedatatrump.push(vote_rows[i].trump_votes);
              datedatabidenadd.push(vote_rows[i].biden_votes);
              datedatatrumpadd.push(vote_rows[i].trump_votes);
              datedatabidenadddiff.push(vote_rows[i].biden_votes);
              datedatatrumpadddiff.push(vote_rows[i].trump_votes);
              datedataotheradd.push(vote_rows[i].other_votes);
              datedatatotaladd.push(vote_rows[i].votes);
              datedatatrump.push(vote_rows[i].trump_votes);
              datedatatotal.push(vote_rows[i].votes);
              datedataother.push(vote_rows[i].other_votes);
              perremainingtrump.push(vote_rows[i].remaining_percent_trump);
              perremainingbiden.push(vote_rows[i].remaining_percent_biden);
              
              
          }
          else if( i % parse_interval != 0 ){
              dateheaders.push(vote_rows[i].timestamp);
              datedatabiden.push(vote_rows[i].biden_votes);
              datedatatrump.push(vote_rows[i].trump_votes);
              datedataother.push(vote_rows[i].other_votes);
              datedatabidenadd.push(vote_rows[i].biden_votes-vote_rows[i-1].biden_votes);
              datedatatrumpadd.push(vote_rows[i].trump_votes-vote_rows[i-1].trump_votes);
              datedataotheradd.push(vote_rows[i].other_votes-vote_rows[i-1].other_votes);
              datedatatotaladd.push(vote_rows[i].votes-vote_rows[i-1].votes);
              datedatabidenadddiff.push(vote_rows[i].biden_votes - vote_rows[i-1].biden_votes);
              datedatatrumpadddiff.push(vote_rows[i].trump_votes - vote_rows[i-1].trump_votes);
              datedatatotal.push(vote_rows[i].votes);
              perremainingtrump.push(vote_rows[i].remaining_percent_trump);
              perremainingbiden.push(vote_rows[i].remaining_percent_biden);
          }
          else if(i % parse_interval == 0) {
              dateheaders.push(vote_rows[i].timestamp);
              datedatabiden.push(vote_rows[i].biden_votes);
              datedatatrump.push(vote_rows[i].trump_votes);
              datedataother.push(vote_rows[i].other_votes);
              datedatatotal.push(vote_rows[i].votes);
              datedatabidenadd.push(vote_rows[i].biden_votes-vote_rows[i-1].biden_votes);
              datedatatrumpadd.push(vote_rows[i].trump_votes-vote_rows[i-1].trump_votes);
              datedataotheradd.push(vote_rows[i].other_votes-vote_rows[i-1].other_votes);
              datedatatotaladd.push(vote_rows[i].votes-vote_rows[i-1].votes);
              datedatabidenadddiff.push(vote_rows[i].biden_votes - vote_rows[i-1].biden_votes);
              datedatatrumpadddiff.push(vote_rows[i].trump_votes - vote_rows[i-1].trump_votes);
              perremainingtrump.push(vote_rows[i].remaining_percent_trump);
              perremainingbiden.push(vote_rows[i].remaining_percent_biden);
  
  
              dateheaders_store.push(dateheaders);
              dateheaders = []; 
              datedatabiden_store.push(datedatabiden);
              datedatabiden = [];
              datedatabidenadd_store.push(datedatabidenadd);
              datedatabidenadd = [];
              datedatatrump_store.push(datedatatrump);
              datedatatrump = [];  
              datedatatrumpadd_store.push(datedatatrumpadd);
              datedatatrumpadd = [];  
              datedatatotal_store.push(datedatatotal);
              datedatatotal = []; 
              datedataother_store.push(datedataother);
              datedataother = [];     
              datedataotheradd_store.push(datedataotheradd);
              datedataotheradd = [];       
              datedatatotaladd_store.push(datedatatotaladd);
              datedatatotaladd = [];  
              datedatabidenadddiff_store.push(datedatabidenadddiff);
              datedatabidenadddiff = [];       
              datedatatrumpadddiff_store.push(datedatatrumpadddiff);
              datedatatrumpadddiff = [];    
              perremainingtrump_store.push(perremainingtrump);
              perremainingtrump = [];
              perremainingbiden_store.push(perremainingbiden);
              perremainingbiden = [];                                          
          }
          else{
              dateheaders.push(vote_rows[i].timestamp);
              datedatabiden.push(vote_rows[i].biden_votes);
              datedatatrump.push(vote_rows[i].trump_votes);
              datedataother.push(vote_rows[i].other_votes);
              datedatatotal.push(vote_rows[i].votes);
              datedatabidenadd.push(vote_rows[i].biden_votes-vote_rows[i-1].biden_votes);
              datedatatrumpadd.push(vote_rows[i].trump_votes-vote_rows[i-1].trump_votes);
              datedataotheradd.push(vote_rows[i].other_votes-vote_rows[i-1].other_votes);
              datedatatotaladd.push(vote_rows[i].votes-vote_rows[i-1].votes);
              datedatabidenadddiff.push(vote_rows[i].biden_votes - vote_rows[i-1].biden_votes);
              datedatatrumpadddiff.push(vote_rows[i].trump_votes - vote_rows[i-1].trump_votes);
              perremainingtrump.push(vote_rows[i].remaining_percent_trump);
              perremainingbiden.push(vote_rows[i].remaining_percent_biden);
          }
  
      }
  
      console.log("Date Total Add: ", datedatatotaladd_store);
      console.log("Date Biden Add Diff: ", datedatabidenadddiff_store);
      console.log("Date Trump Add Diff: ", datedatatrumpadddiff_store);
  
      // PieChart calculations
     
      if(datedatabiden_store != null) {
          for(var i = 0;i < datedatabiden_store.length;i++){
                  var total_amt = 0;
                  var total_biden = 0;
                  var total_trump = 0;
                  var total_other = 0;
                  for(var j = 0;j < datedatatotal_store[i].length;j++){
                      total_amt += datedatatotal_store[i][j];
                      total_biden += datedatabiden_store[i][j];
                      total_trump += datedatatrump_store[i][j];
                      total_other += datedataother_store[i][j];
                      if(j == 0 ){
                          pieheaders[i] = dateheaders_store[i][j] + " To ";
                      }
                      if(j == dateheaders_store[i].length-1){
                          pieheaders[i] +=  dateheaders_store[i][j];
                      }
                  // console.log(pieheaders);
                  }
                  totalslices.push(total_amt);                             
                  bidenslices.push(total_biden);                           
                  trumpslices.push(total_trump);                               
                  otherslices.push(total_other);
              }
      }
  
  
      console.log("Other Slices: ",otherslices);
      let dataLoad = {
        "dateHeadersStore": dateheaders_store,
        "dateDataBidenStore": datedatabiden_store,
        "dateDataBidenAddStore": datedatabidenadd_store,
        "dateDataBidenAddDiffStore": datedatabidenadddiff_store,
        "dateDataTrumpStore": datedatatrump_store,
        "dateDataTrumpAddStore":  datedatatrumpadd_store,
        "dateDataTrumpAddDiffStore": datedatatrumpadddiff_store,
        "dateDataTotalStore": datedatatotal_store,
        "dateDataOtherStore": datedataother_store,
        "dateDataOtherAddStore": datedataotheradd_store,
        "dateDataTotalAddStore": datedatatotaladd_store,
        "perRemainingTrumpStore": perremainingtrump_store,
        "perRemainingBidenStore": perremainingbiden_store,
        "bidenSlices": bidenslices,
        "trumpSlices": trumpslices,
        "otherSlices": otherslices,
        "totalSlices": totalslices,
        "pieHeaders":  pieheaders
      }
  
      return dataLoad;
  }
  

}
