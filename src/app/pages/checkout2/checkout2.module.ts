import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Checkout2PageRoutingModule } from './checkout2-routing.module';

import { Checkout2Page } from './checkout2.page';
import { HttpsServices } from 'src/app/services/https.service';





import { ConfigManager } from 'src/app/services/config.service';


import { UserSession } from 'src/app/entity/UserSession';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { DropdownPageModule } from 'src/app/modal/dropdown/dropdown.module';


//Perfecct Scrollbar
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
 
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


//Swiper
import { SwiperModule, SwiperConfigInterface,
  SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { OrderService } from 'src/app/services/order.service';
import { PostcodeService } from 'src/app/services/postcode.service';

//Datetime
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Checkout2PageRoutingModule,
    ReactiveFormsModule,
    SwiperModule,
    FontAwesomeModule,
    PerfectScrollbarModule,
    DropdownPageModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,

  ],
  declarations: [Checkout2Page],
  providers: [HttpsServices,ConfigManager,OrderService,UserSession,PostcodeService, {
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
  }]
  
})
export class Checkout2PageModule {}
