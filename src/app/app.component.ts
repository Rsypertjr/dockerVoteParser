import { Component } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute} from '@angular/router'; 


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = '2020 Presidential Vote Parsing';

  constructor(router:Router,route:ActivatedRoute){}
  
  // Will call methods on child invoked in router-outlet.  triggered by event on outlet
 onActivate(componentReference) {
     console.log(componentReference)
     componentReference.reset();
 }

}
