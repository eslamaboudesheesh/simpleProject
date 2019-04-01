import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { process, State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { classToClass } from "class-transformer";
import { NotificationService } from '@progress/kendo-angular-notification';
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';

import { MyServiceService } from './stores/my-service.service';
import { ResponsData } from './stores/models/stores-model';
import { DataResponse } from './stores/models/dataresponse.model';
import { ResponseViewModel } from './stores/models/responsoModel';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class AppComponent implements OnInit {

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

    // Used to listen on the response from the service
    public ResponsDataModel: ResponsData;
    public projectsResult: any;
    public Dialogheader = "Add Company";
    public dialogOpened = false;
    public addModeDialoge = false;
    public loading = false;
    public isSubmit = false;

    // Used into two way data binding
    public selectedObj: DataResponse;

    // Subscription variables
    public addModelSub: Subscription;
    public deletAgentSub: Subscription;
    public getAgentsSubscription: Subscription;

    constructor(private MyServiceService: MyServiceService, private notificationService: NotificationService) {

        this.selectedObj = new DataResponse();
        this.ResponsDataModel = new ResponsData();
    }

    ngOnInit() {

        this.loading = true;

        this.getdata();
    }

    // Used to load all products from database
    getdata() {

        this.getAgentsSubscription = this.MyServiceService.GetAgents().subscribe((res: ResponsData) => {

            if (res != null) {

                this.projectsResult = res.data;
                this.loadItems(this.projectsResult);
                
            }else{

                this.notificationService.show({
                    content: 'Sorry error occured during getting data from DB',
                    cssClass: 'button-notification',
                    animation: { type: 'slide', duration: 400 },
                    position: { horizontal: 'center', vertical: 'bottom' },
                    type: { style: 'error', icon: true },
                    closable: true
                });

                this.loading = false;
            }

        }),((error:any)=>{

            this.notificationService.show({
                content: 'Backend error',
                cssClass: 'button-notification',
                animation: { type: 'slide', duration: 400 },
                position: { horizontal: 'center', vertical: 'bottom' },
                type: { style: 'error', icon: true },
                closable: true
            });

            this.loading = false;
        });
    }

    //#region Gridview functions

    public dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.projectsResult, this.state);
    }

    loadItems(projectsResult: any) {
        
        this.gridData = process(projectsResult, this.state);
        this.loading = false;
    }

    //#endregion

    //#region Dialog main functions

    updataProject(form: NgForm) {

        if (form.valid) {
            this.dialogOpened = false;
        }

    }

    close() {

        this.dialogOpened = false;
    }
    open() {

        this.Dialogheader = "Add Product";
        this.addModeDialoge = true;
        this.dialogOpened = true;
        this.isSubmit = false
    }

    //#endregion

    //#region CRUD operations for product  

    addProduct(form: NgForm) {

        if (form.valid) {

            this.addModelSub = this.MyServiceService.Addproductes(this.selectedObj).subscribe((res: ResponseViewModel) => {

                if (res.message === "success") {

                    this.notificationService.show({
                        content: 'Your data has been saved. Time for tea!',
                        cssClass: 'button-notification',
                        animation: { type: 'slide', duration: 400 },
                        position: { horizontal: 'center', vertical: 'bottom' },
                        type: { style: 'success', icon: true },
                        closable: true
                    });

                    this.getdata();

                } else {

                    this.notificationService.show({
                        content: 'Your data has been saved. Time for tea!',
                        cssClass: 'button-notification',
                        animation: { type: 'slide', duration: 400 },
                        position: { horizontal: 'center', vertical: 'bottom' },
                        type: { style: 'error', icon: true },
                        closable: true
                    });
                }
            })
            this.isSubmit = false;
            this.dialogOpened = false;
            this.loading = true;
        } else {
            this.isSubmit = true;
        }
    }

    changeData(data) {

        this.projectsResult.map((product: any) => {
            if (product.id === data.id)
                this.selectedObj = classToClass(product);
        });
    }

    editOpen(data: any) {
        let selectedData = classToClass(data);
        this.Dialogheader = "Edit To Product";
        this.addModeDialoge = false;
        this.dialogOpened = true;
        this.changeData(selectedData);
    }

    updateproduct(form: NgForm) {

        if (form.valid) {

            this.addModelSub = this.MyServiceService.UpdateProject(this.selectedObj).subscribe((res: ResponseViewModel) => {

                if (res.message === "success") {

                    this.notificationService.show({
                        content: 'Your data has been saved. Time for tea!',
                        cssClass: 'button-notification',
                        animation: { type: 'slide', duration: 400 },
                        position: { horizontal: 'center', vertical: 'bottom' },
                        type: { style: 'success', icon: true },
                        closable: true
                    });

                    this.getdata();

                } else {

                    this.notificationService.show({
                        content: 'Your data has been saved. Time for tea!',
                        cssClass: 'button-notification',
                        animation: { type: 'slide', duration: 400 },
                        position: { horizontal: 'center', vertical: 'bottom' },
                        type: { style: 'error', icon: true },
                        closable: true
                    });
                }
            })
            this.isSubmit = false;
            this.dialogOpened = false;
            this.loading = true;
        } else {
            this.isSubmit = true;
        }
    }

    DeletedProduct(ID: number) {

        if (confirm("Are you sure you want to delete this product?")) {

            this.addModelSub = this.MyServiceService.DeletedProject(ID).subscribe((res: ResponseViewModel) => {

                if (res.message === "deleted") {

                    this.notificationService.show({
                        content: 'Your data has been saved. Time for tea!',
                        cssClass: 'button-notification',
                        animation: { type: 'slide', duration: 400 },
                        position: { horizontal: 'center', vertical: 'bottom' },
                        type: { style: 'success', icon: true },
                        closable: true
                    });

                    this.getdata();

                } else {

                    this.notificationService.show({
                        content: 'Your data has been saved. Time for tea!',
                        cssClass: 'button-notification',
                        animation: { type: 'slide', duration: 400 },
                        position: { horizontal: 'center', vertical: 'bottom' },
                        type: { style: 'error', icon: true },
                        closable: true
                    });
                }
            })

            this.loading = true;
        }
    }

    //#endregion
}
