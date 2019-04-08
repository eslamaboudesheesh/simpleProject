import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MyServiceService } from '../my-service.service';
import { Subscription } from 'rxjs';
import { process, State } from '@progress/kendo-data-query';
import { SelectableSettings, SelectionEvent, SelectAllCheckboxState } from '@progress/kendo-angular-grid';

import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { ResponseViewModel } from '../models/responsoModel';
import { NotificationService } from '@progress/kendo-angular-notification';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { classToClass } from 'class-transformer';

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
  public idisabled = true;
  public searchsubs: Subscription;
  public mySelection: any = [];
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

  public selectAllState: SelectAllCheckboxState = 'unchecked';

  constructor(private formBuilder: FormBuilder, private SearchProjectServ: MyServiceService, private notificationService: NotificationService) {
  }

  ngOnInit() {

  }


  ngOnDestroy() {
    if (this.searchsubs)
      this.searchsubs.unsubscribe();
  }

  public onSelectedRowChange(ev: SelectionEvent) {

    let productsList: any = [];

    if (ev.selected) {

      productsList = classToClass(ev.selectedRows);

      productsList.forEach(element => {

        element.dataItem.quantity = 1;

        if (!this.mySelection.some((item: any) => item.id === ev.selectedRows[0].dataItem.id)) {

          this.notificationService.show({
            content: 'this product is added successfully',
            cssClass: 'button-notification',
            animation: { type: 'slide', duration: 2000 },
            position: { horizontal: 'center', vertical: 'bottom' },
            type: { style: 'success', icon: true },
            closable: true
          });

          this.mySelection.push(element.dataItem);

         this.gridData.data = this.gridData.data.filter(obj => {
           return obj.id != element.dataItem.id
          });

        } else {
          this.notificationService.show({
            content: 'this product is added before, please add another one',
            cssClass: 'button-notification',
            animation: { type: 'slide', duration: 2000 },
            position: { horizontal: 'center', vertical: 'bottom' },
            type: { style: 'success', icon: true },
            closable: true
          });
        }

      });
    } else {
      this.notificationService.show({
        content: 'this product is deleted successfully',
        cssClass: 'button-notification',
        animation: { type: 'slide', duration: 2000 },
        position: { horizontal: 'center', vertical: 'bottom' },
        type: { style: 'success', icon: true },
        closable: true
      });
      this.mySelection.splice(this.mySelection.indexOf(ev.deselectedRows[0].dataItem), 1);
    }


  }



  public onSelectedKeysChange(e) {

    const len = this.mySelection.length;

  }

  // public selectedCallback = (args) => args.dataItem;

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


  savebilling() {

    this.showTableSearch = false;
    console.log(this.mySelection, "all Data in selection");
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

    let oldQTY: number;

    this.gridData.data.map((element => {
      if (element.id === dataItem.id)
        oldQTY = element.quantity;
    }))

    let newQTY = formGroup.value.quantity;

    if (newQTY > oldQTY) {
      this.notificationService.show({
        content: `quantity must be less than ${oldQTY}`,
        cssClass: 'button-notification',
        animation: { type: 'slide', duration: 400 },
        position: { horizontal: 'center', vertical: 'bottom' },
        type: { style: 'error', icon: true },
        closable: true
      });
      return
    }

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
