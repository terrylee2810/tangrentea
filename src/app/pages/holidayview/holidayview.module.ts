import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HolidayviewPageRoutingModule } from './holidayview-routing.module';
import { HolidayviewPage } from './holidayview.page';
import { HttpsServices } from 'src/app/services/https.service';
import { ConfigManager } from 'src/app/services/config.service';
import { UserSession } from 'src/app/entity/UserSession';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Holiday } from 'src/app/entity/Holiday';
//Perfecct Scrollbar
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
 
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
import { UserService } from 'src/app/services/user.service';
import { OffdayService } from 'src/app/services/offday.service'; 
//Datetime
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HolidayviewPageRoutingModule,
    FontAwesomeModule,
    PerfectScrollbarModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  declarations: [HolidayviewPage],
  providers: [HttpsServices,ConfigManager,UserService,Holiday,OffdayService,UserSession,{
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
  }] 
})
export class HolidayviewPageModule {}
