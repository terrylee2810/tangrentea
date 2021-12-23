import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { IonicModule } from '@ionic/angular';

import { PopproductPageRoutingModule } from './popproduct-routing.module';

import { PopproductPage } from './popproduct.page';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
//Perfecct Scrollbar
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { BrowserModule } from '@angular/platform-browser'
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,BrowserModule,
    PopproductPageRoutingModule,
    FontAwesomeModule,
    PerfectScrollbarModule,
  ],
  // declarations: [PopproductPage],
  providers: [ {
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
  }]
})
export class PopproductPageModule {}
