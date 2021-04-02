import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetstateService {

  constructor( private httpClient:HttpClient) {}


  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type':'application/json'})
  };
  
get_state(state):Observable<any>{
  
    let stateUrl ='https://static01.nyt.com/elections-assets/2020/data/api/2020-11-03/race-page/'+ state.toLowerCase().replace(/\-/,'') + '/president.json';
    return this.httpClient.get(stateUrl).pipe(
      retry(3),
      catchError(this.httpErrorHandler)
    );
  }


  private httpErrorHandler (error: HttpErrorResponse){
    if (error.error instanceof ErrorEvent){
      console.error('A client side error occurs.  The error message is ' + error.message);
    } else {
      console.error(
        "An error happened in server.  The HTTP status code is " + error.status + " and the error returned is " + error.message
      );
    }
    return throwError("Error occurred.  Please try again");
  }


}
