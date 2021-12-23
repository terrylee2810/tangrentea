
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductcalendarviewPageRoutingModule } from './productcalendarview-routing.module';
import { ProductcalendarviewPage } from './productcalendarview.page';
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
import { UserService } from 'src/app/services/user.service';
import { ProductCalendarService } from 'src/app/services/productcalendar.service';
import { ProductCalendar } from 'src/app/entity/ProductCalendar';

//Datetime
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { AgGridModule } from 'ag-grid-angular';
import { ProductService } from 'src/app/services/product.service';
import { PopproductPage } from 'src/app/modal/popproduct/popproduct.page';

@NgModule({
  // declarations: [PopproductPage],
  entryComponents: [PopproductPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductcalendarviewPageRoutingModule,
    FontAwesomeModule,
    PerfectScrollbarModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    AgGridModule.withComponents([]),
  ],
  declarations: [ProductcalendarviewPage,PopproductPage],
  providers: [HttpsServices,ConfigManager,UserService,ProductCalendar,ProductCalendarService,ProductService,UserSession,{
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
  }]
})
export class ProductcalendarviewPageModule {}
