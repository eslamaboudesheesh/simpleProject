import { Component, OnInit } from '@angular/core';
import { process, State } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { classToClass } from "class-transformer";

import {
    GridComponent,
    GridDataResult,
    DataStateChangeEvent
} from '@progress/kendo-angular-grid';
import { MyServiceService } from './stores/my-service.service';
import { ResponsData } from './stores/models/stores-model';
import { DataResponse } from './stores/models/dataresponse.model';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public ResponsDataModel: ResponsData;
    projectsResult: any;
    public gridData: GridDataResult;
    Dialogheader = "Add Company";

    public dialogOpened = false;
    public addModeDialoge = false;
    public loading = false;
    public isSubmit = false;

    public selectedObj: DataResponse;

    constructor(private MyServiceService: MyServiceService) {
        this.selectedObj = new DataResponse();
        this.ResponsDataModel = new ResponsData();

    }

    ngOnInit() { this.getdata() }

    public state: State = {
        skip: 0,
        take: 5,

        // Initial filter descriptor
        filter: {
            logic: 'and',
            filters: [{ field: 'name', operator: 'contains', value: '' }]
        }
    };



    public dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.projectsResult, this.state);
    }

    getdata() {

        this.MyServiceService.GetAgents().subscribe((res: ResponsData) => {
            console.log(res.data);
            this.projectsResult = res.data;
            this.loadItems(this.projectsResult);
        });
    }

    loadItems(projectsResult: any) {
        this.gridData = process(projectsResult, this.state);
    }


    updataProject(form: NgForm) {
        if (form.valid) {
        
            this.dialogOpened = false;
        }
    }

    close() {
        this.dialogOpened = false;
    }
    open() {
        this.Dialogheader = "Add Company";
        this.addModeDialoge = true;
        this.dialogOpened = true;
        this.isSubmit = false
    }


    editOpen(data: any) {
        let selectedData = classToClass(data);
        this.Dialogheader = "Edit To Company";
        this.addModeDialoge = false;
        this.dialogOpened = true;
        this.changeData(selectedData);
    }

    changeData(data) {

        this.projectsResult.map((product: any) => {
            if (product.id === data.id)
                this.selectedObj = classToClass(product);
        });

        // data = this.selectedObj;

    }


    // addUpdatAgent(form: NgForm, flagealert: boolean) {
    //     if (form.valid) {
    //       this.agentEditeModelSub = this.MasterDataService.AddUpdateAgent(this.agentViewModel).subscribe((response: ResponseViewModel) => {
    //         this.agentViewModel = new AgentViewModel();
    //         if (response.Success) {
    //           this.loading = false;
    //           this.loadAgents();
    
    //           if (flagealert) {
    //             this.notificationsService.Notify({
    //               Type: 'success',
    //               Title: 'Success',
    //               Message: 'Row saved successfully'
    //             });
    //           } else {
    //             this.notificationsService.Notify({
    //               Type: 'success',
    //               Title: 'Success',
    //               Message: 'Row updated successfully'
    //             });
    //           }
    //         }
    //         else {
    //           if (response.ErrorMessage && response.ErrorMessage.length > 0) {
    
    //             this.notificationsService.Notify({
    //               Type: 'error',
    //               Title: 'Error while saving row.',
    //               Message: response.ErrorMessage[0]
    //             });
    
    //             this.loading = false;
    
    //           }
    //         }
    //       })
    //       this.isSubmit = false;
    //       this.dialogOpened = false;
    //       this.loading = true;
    //     } else {
    //       this.isSubmit = true;
    //     }
    //   }
    
    //   deleteAgentRow(ID: number) {
    //     if (confirm("Are you sure you want to delete this Agent?")) {
    
    //       this.deletAgentSub = this.MasterDataService.DeletedAgent(ID).subscribe((res: ResponseViewModel) => {
    //         if (res.Success) {
    //           this.loading = false;
    //           this.loadAgents();
    //           this.notificationsService.Notify({
    //             Type: 'success',
    //             Title: 'Success',
    //             Message: 'Row removed successfully  '
    //           });
    
    //         }
    //         else {
    //           if (res.ErrorMessage && res.ErrorMessage.length > 0) {
    //             this.notificationsService.Notify({
    //               Type: 'error',
    //               Title: 'error',
    //               Message: res.ErrorMessage[0]
    //             });
    //             this.loading = false;
    //           }
    //         }
    //       })
    //       this.loading = true;
    //     } else {
    //       this.loading = false;
    //     }
    //   }
    

}
