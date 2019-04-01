import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { NotificationModule } from '@progress/kendo-angular-notification';


import { GridModule , ExcelModule ,PDFModule } from '@progress/kendo-angular-grid';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { StoreComponent } from './stores/store/store.component';
import { StoresComponent } from './stores/stores.component';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { FormsModule } from '@angular/forms';



const routes: Routes = [
  { path: 'stores', component: AppComponent },
  { path: '', redirectTo: 'stores', pathMatch: 'full' },
  { path: '**', redirectTo: 'stores' },
];

@NgModule({
  bootstrap: [
    AppComponent
  ],
  declarations: [
    AppComponent,
    StoreComponent,
    StoresComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DialogsModule,
    DialogModule,
    ButtonsModule,
    GridModule,
    AngularFontAwesomeModule,
    RouterModule.forRoot(routes),
    DateInputsModule,
    FormsModule,
    InputsModule,
    ExcelModule,
    PDFModule,
    NotificationModule

  ]
})
export class AppModule { }