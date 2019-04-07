import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MyServiceService } from '../my-service.service';
import { Subscription } from 'rxjs';
import { process, State } from '@progress/kendo-data-query';
import { SelectableSettings } from '@progress/kendo-angular-grid';

import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { ResponseViewModel } from '../models/responsoModel';
import { NotificationService } from '@progress/kendo-angular-notification';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-daysale',
  templateUrl: './daysale.component.html',
  styleUrls: ['./daysale.component.scss']
})

export class DaysaleComponent implements OnInit, OnDestroy {
  valueSearch: any;
  projectsResult: any;
  public isSubmit = false;
  public loading = false;

  public showTableSearch = false;
  public searchsubs: Subscription;
  public mySelection: number[] = [];
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

  constructor(private formBuilder: FormBuilder, private SearchProjectServ: MyServiceService, private notificationService: NotificationService) {
  }

  ngOnInit() {

  }


  ngOnDestroy() {
    if (this.searchsubs)
      this.searchsubs.unsubscribe();
  }

  public selectedCallback = (args) => args.dataItem;

  //#region Gridview functions

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridData = process(this.projectsResult, this.state);
  }

  loadItems(projectsResult: any) {

    this.gridData = process(this.projectsResult, this.state);
    this.loading = false;
  }

  //#endregion




  SearchProduct(form: NgForm) {

    this.isSubmit = true;
    if (form.valid) {
      this.isSubmit = false;
      this.loading = true
      this.searchsubs = this.SearchProjectServ.SearchProject(this.valueSearch).subscribe((res: ResponseViewModel) => {
        this.projectsResult = res.data.map((res) => {
          return res;

        })
        if ((res.message === "success") && (res.data.length > 0)) {
          this.showTableSearch = true;
          this.loadItems(this.projectsResult);

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

  public cellClickHandler({ sender, rowIndex, columnIndex, dataItem }) {
    sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
  }

  public cellCloseHandler(args: any) {
    debugger
    const { formGroup, dataItem } = args;

    if (!formGroup.valid) {
      // prevent closing the edited cell if there are invalid values.
      args.preventDefault();
    } else if (formGroup.dirty) {

      this.mySelection.map((pro: any) => {
        if (pro.id === dataItem.id)
          pro.quantity = formGroup.value.quantity;
      })

    }
  }

  public removeHandler({ sender, dataItem }) {

    this.mySelection.map((product: any) => {
      if (product.id === dataItem.id) {

        let index = this.mySelection.indexOf(product);

        this.mySelection.splice(index, 1);
      }
    })

  }

  public createFormGroup(dataItem: any): FormGroup {
    return this.formBuilder.group({
      'quantity': [dataItem.quantity, Validators.compose([Validators.required, Validators.pattern('^[0-9]{1,3}')])]
    });
  }

}
