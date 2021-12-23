import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JxorderlistPageRoutingModule } from './jxorderlist-routing.module';

import { JxorderlistPage } from './jxorderlist.page';
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
import { User } from 'src/app/entity/User';

import { AgGridModule } from 'ag-grid-angular';
import { OrderService } from 'src/app/services/order.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JxorderlistPageRoutingModule,
    FontAwesomeModule,
    PerfectScrollbarModule,
    AgGridModule.withComponents([]),
  ],
  declarations: [JxorderlistPage],
  providers: [HttpsServices,ConfigManager,User,UserService,OrderService ,UserSession,{
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
  }]
})
export class JxorderlistPageModule {}
