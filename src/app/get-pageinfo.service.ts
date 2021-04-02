import { Injectable, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Observable, throwError, Subject, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GetPageinfoService {
  
  @ViewChild(DataTableDirective, { static: false }) dataTableElement: DataTableDirective;
  
  getPageInfo():any{   
    return from(this.dataTableElement.dtInstance.then((dtInstance: DataTables.Api) => dtInstance)).pipe(map((res) => res));
  }


  constructor() { }
}
