import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FaqPageRoutingModule } from './faq-routing.module';

import { FaqPage } from './faq.page';
import { HttpsServices } from 'src/app/services/https.service';





import { ConfigManager } from 'src/app/services/config.service';


import { UserSession } from 'src/app/entity/UserSession';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/entity/Product';
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
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FaqPageRoutingModule,
    ReactiveFormsModule,
    SwiperModule,
    FontAwesomeModule,
    PerfectScrollbarModule,
    DropdownPageModule

  ],
  declarations: [FaqPage],
  providers: [HttpsServices,ConfigManager,Product,ProductService,UserSession, {
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
  }]
  
})
export class FaqPageModule {}
