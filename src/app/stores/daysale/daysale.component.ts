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
  projectsResult: any = [];
  public isSubmit = false;
  public loading = false;
  private hideAfter: number = 4000;
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

  public calculatedPrice: number = 1;

  constructor(private formBuilder: FormBuilder, private SearchProjectServ: MyServiceService, private notificationService: NotificationService) {
  }

  ngOnInit() {

  }


  ngOnDestroy() {
    if (this.searchsubs)
      this.searchsubs.unsubscribe();
  }

  public onSelectedRowChange(selectedRow: any) {

    let cloneSelectedProduct: any;

    if (selectedRow != null) {

      cloneSelectedProduct = classToClass(selectedRow);

      if (!this.mySelection.some((item: any) => item.id === cloneSelectedProduct.id)) {

        this.notificationService.show({
          content: 'this product is added successfully',
          cssClass: 'button-notification',
          animation: { type: 'fade', duration: 200 },
          position: { horizontal: 'center', vertical: 'bottom' },
          type: { style: 'success', icon: true },
          hideAfter: this.hideAfter
        });

        cloneSelectedProduct.quantityForSale = 1
        cloneSelectedProduct.priceTotal = ( cloneSelectedProduct.quantityForSale * cloneSelectedProduct.priceForPicese) + " LE";
        // this.calculatedPrice = Number(cloneSelectedProduct.priceForPicese * 1);
        this.mySelection.push(cloneSelectedProduct);

        this.gridData.data = this.gridData.data.filter(obj => {
          return obj.id != cloneSelectedProduct.id
        });


      } else {
        this.notificationService.show({
          content: 'this product is added before, please add another one',
          cssClass: 'button-notification',
          animation: { type: 'fade', duration: 200 },
          position: { horizontal: 'center', vertical: 'bottom' },
          type: { style: 'success', icon: true },
          hideAfter: this.hideAfter
        });
      }
    }


    // if (ev.selected) {
    // }
    // else {

    //   this.notificationService.show({
    //     content: 'this product is deleted successfully',
    //     cssClass: 'button-notification',
    //     animation: { type: 'fade', duration: 200 },
    //     position: { horizontal: 'center', vertical: 'bottom' },
    //     type: { style: 'success', icon: true },
    //     hideAfter: this.hideAfter
    //   });

    //   this.mySelection.splice(this.mySelection.indexOf(ev.deselectedRows[0].dataItem), 1);

    // }

    if ((this.gridData.data.length) === 0) {
      this.showTableSearch = false;
    }

    if ((this.mySelection.length) > 0) {
      this.idisabled = false;
    }


  }

  //   public onSelectAllChange(checkedState: SelectAllCheckboxState) {

  //     if (checkedState === 'checked') {
  //         this.mySelection = this.gridData.data.map((item) => item);
  //         this.selectAllState = 'checked';
  //     } else {
  //         this.mySelection = [];
  //         this.selectAllState = 'unchecked';
  //     }
  // }

  // public selectedCallback = (args) => args.dataItem;

  //#region Gridview functions

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridData = process(this.projectsResult, this.state);
  }

  loadItems(projectsResult: any) {

    this.gridData = process(projectsResult, this.state);
    this.loading = false;

    if (projectsResult.length == 0) {

      this.notificationService.show({
        content: 'this data from search result added before in bill table',
        cssClass: 'button-notification',
        animation: { type: 'fade', duration: 400 },
        position: { horizontal: 'right', vertical: 'top' },
        type: { style: 'warning', icon: true },
        hideAfter: this.hideAfter
      });

      this.showTableSearch = false;

    }
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

          let newList: any = [];

          if (this.mySelection.length > 0) {
            this.projectsResult.forEach((obj: any) => {
              if (!this.mySelection.some((item: any) => item.id === obj.id))
                newList.push(obj);
            });
            this.loadItems(newList);
          } else {
            this.loadItems(this.projectsResult);
          }



        } else {

          this.notificationService.show({
            content: 'no data match this search criteria',
            cssClass: 'button-notification',
            animation: { type: 'slide', duration: 400 },
            position: { horizontal: 'center', vertical: 'bottom' },
            type: { style: 'error', icon: true },
            closable: true
          });

          this.showTableSearch = false;

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

  public oldQauntity = []

  public cellCloseHandler(args: any) {

    const { formGroup, dataItem } = args;

    let oldQTY: number;
    this.mySelection.map((e => {
      // e.quantityForSale
      if (e.id === dataItem.id) {
        if (Number(e.quantityForSale) < 2)
          e.quantityForSale = 1;
        oldQTY = e.quantity;
      }
    }))

    let newQTY = formGroup.value.quantityForSale;

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
    } else {

      this.mySelection.map((pro: any) => {
        if (pro.id === dataItem.id){
          pro.quantityForSale = Number(formGroup.value.quantityForSale);
          // this.calculatedPrice = Number(newQTY * dataItem.priceForPicese);
          pro.priceTotal = (pro.quantityForSale * dataItem.priceForPicese) + " LE";
        }
      })
    //   this.mySelection.map((e )=> {
    //     if (e.id === dataItem.id) {
          
    //     }
    // });
  }
    if (!formGroup.valid) {
      // prevent closing the edited cell if there are invalid values.
      args.preventDefault();
    } 
    // else if (formGroup.dirty) {

    //   this.mySelection.map((pro: any) => {
    //     if (pro.id === dataItem.id)
    //       pro.quantityForSale = Number(formGroup.value.quantityForSale);
    //       this.calculatedPrice = Number(newQTY * dataItem.priceForPicese);
    //       pro.priceTotal = this.calculatedPrice;
    //   })

    // }
  }

  public removeHandler(dataItem) {

    let index = this.mySelection.indexOf(dataItem);

    this.mySelection.splice(index, 1);

    if ((this.mySelection.length) == 0) {
      this.idisabled = true;
    }

  }

  public createFormGroup(dataItem: any): FormGroup {

    return this.formBuilder.group({
      'quantityForSale': [dataItem.quantityForSale, Validators.compose([Validators.required, Validators.pattern('^[0-9]{1,3}')])]
    });
  }

}
