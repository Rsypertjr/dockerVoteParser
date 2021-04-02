import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GetVotesComponent } from './get-votes/get-votes.component';
import { VotesTableComponent } from './votes-table/votes-table.component';

const routes: Routes = [
 
  { path:'votes', component: GetVotesComponent},
  { path:'', redirectTo: '/votes', pathMatch: 'full'}
  /* { path:'list', component: ExpenseEntryListComponent },
  { path:'expenses', component: ExpenseEntryListComponent, canActivate: [ExpenseGuard]},
  { path:'expenses/detail/:id', component: ExpenseEntryComponent, canActivate: [ExpenseGuard]},
  { path:'relist',  redirectTo: '/list', pathMatch: 'full' },
  { path:'',  redirectTo: '/expenses', pathMatch: 'full' } ,
  { path:'login', component: LoginComponent },
  { path:'logout', component: LogoutComponent } */
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)  
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
