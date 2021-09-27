import { Component } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute} from '@angular/router'; 
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'vote-parser';

  constructor(router:Router,route:ActivatedRoute, private titleService: Title){
    this.titleService.setTitle(this.title);

  }
  
  // Will call methods on child invoked in router-outlet.  triggered by event on outlet
 onActivate(componentReference) {
     console.log(componentReference)
     componentReference.reset();
     
 }

}
