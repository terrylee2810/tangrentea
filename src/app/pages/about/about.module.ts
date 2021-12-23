import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AboutPageRoutingModule } from './about-routing.module';

import { AboutPage } from './about.page';
import { HttpsServices } from 'src/app/services/https.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


//Perfecct Scrollbar
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AgmCoreModule } from '@agm/core';
 
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
    AboutPageRoutingModule,
    ReactiveFormsModule,
    SwiperModule,
    FontAwesomeModule,
    PerfectScrollbarModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAUxghld9Qm7EoIh3nCc6KOznYEVlCTjN4'
    })
  ],
  declarations: [AboutPage],
  providers: [HttpsServices, {
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
  }]
  
})
export class AboutPageModule {}
