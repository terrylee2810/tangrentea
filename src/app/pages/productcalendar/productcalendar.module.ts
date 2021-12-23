import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductcalendarPageRoutingModule } from './productcalendar-routing.module';
import { ProductcalendarPage } from './productcalendar.page';
import { HttpsServices } from 'src/app/services/https.service';
import { ConfigManager } from 'src/app/services/config.service';
import { UserSession } from 'src/app/entity/UserSession';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

//Perfecct Scrollbar
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
import { AgGridModule } from 'ag-grid-angular';
import { User } from 'src/app/entity/User';
import { ProductCalendarService } from 'src/app/services/productcalendar.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductcalendarPageRoutingModule,
    FontAwesomeModule,
    PerfectScrollbarModule,
    AgGridModule.withComponents([]),
  ],
  declarations: [ProductcalendarPage],
  providers: [HttpsServices,ConfigManager,User,ProductCalendarService,UserSession,{
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
  }]
})
export class ProductcalendarPageModule {}
