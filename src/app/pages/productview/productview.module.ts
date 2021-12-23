import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductviewPageRoutingModule } from './productview-routing.module';
import { ProductviewPage } from './productview.page';
import { HttpsServices } from 'src/app/services/https.service';
import { ConfigManager } from 'src/app/services/config.service';
import { UserSession } from 'src/app/entity/UserSession';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
//Perfecct Scrollbar
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Product } from 'src/app/entity/Product';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
import { UserService } from 'src/app/services/user.service';
import { ProductService } from 'src/app/services/product.service'; 
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductviewPageRoutingModule, 
    FontAwesomeModule,
    PerfectScrollbarModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  declarations: [ProductviewPage],
  providers: [HttpsServices,ConfigManager,Product,ProductService,UserSession,{
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
  }]
})
export class ProductviewPageModule {}
