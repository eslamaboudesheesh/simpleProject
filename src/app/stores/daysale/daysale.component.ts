import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MyServiceService } from '../my-service.service';
import { Subscription } from 'rxjs';
import { State } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { ResponseViewModel } from '../models/responsoModel';
import { NotificationService } from '@progress/kendo-angular-notification';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-daysale',
  templateUrl: './daysale.component.html',
  styleUrls: ['./daysale.component.scss']
})

export class DaysaleComponent implements OnInit, OnDestroy {
  valueSearch: any;
  projectsResult : any ;
  public isSubmit = false;
  public loading = false;

  public showTableSearch = false;
  public searchsubs: Subscription;
  // Gridview variables
  public gridData: GridDataResult;
  public state: State = {
    skip: 0,
    take: 10,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'name', operator: 'contains', value: '' }]
    }
  };

  constructor(private SearchProjectServ: MyServiceService, private notificationService: NotificationService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.searchsubs)
      this.searchsubs.unsubscribe();
  }





  SearchProduct(form: NgForm) {
    
    this.isSubmit = true;
    if (form.valid) {
      this.isSubmit = false;
      this.loading = true
      this.searchsubs = this.SearchProjectServ.SearchProject(this.valueSearch).subscribe((res: ResponseViewModel) => {
         this.projectsResult = res.data.map((res) => {
           return res ;
         })
        if ((res.message === "success") && (res.data.length > 0)) {
          this.showTableSearch = true;

          this.notificationService.show({
            content: 'Your data has been saved. Time for tea!',
            cssClass: 'button-notification',
            animation: { type: 'slide', duration: 400 },
            position: { horizontal: 'center', vertical: 'bottom' },
            type: { style: 'success', icon: true },
            closable: true
          });

        } else {

          this.notificationService.show({
            content: 'no data match this search criteria',
            cssClass: 'button-notification',
            animation: { type: 'slide', duration: 400 },
            position: { horizontal: 'center', vertical: 'bottom' },
            type: { style: 'error', icon: true },
            closable: true
          });

        }
        this.valueSearch = "";
        this.loading = false
      })
    } else {
      this.isSubmit = true;
      this.loading = false;
      console.log("no valid");
    }
  }




  close() {
    this.showTableSearch = false;

  }
}
