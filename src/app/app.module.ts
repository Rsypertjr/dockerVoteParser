import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { VotesTableComponent } from './votes-table/votes-table.component';
import { RouterModule, Routes } from '@angular/router';
import { DataTablesModule } from "angular-datatables";
import { FormsModule } from '@angular/forms';
import { GetVotesComponent } from './get-votes/get-votes.component';
import { VoteChartsComponent } from './vote-charts/vote-charts.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AppComponent,
    VotesTableComponent,
    GetVotesComponent,
    VoteChartsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,   
    HttpClientModule, 
    DataTablesModule,
    FormsModule,
    RouterModule.forRoot([]),
    BrowserAnimationsModule,
    NgbModule
  ],
  providers: [Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
