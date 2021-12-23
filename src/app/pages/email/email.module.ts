import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EmailPageRoutingModule } from './email-routing.module';
import { EmailPage } from './email.page';
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
import { EmailService } from 'src/app/services/email.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmailPageRoutingModule,
    FontAwesomeModule,
    PerfectScrollbarModule,
    AgGridModule.withComponents([]),
  ],
  declarations: [EmailPage],
  providers: [HttpsServices,ConfigManager,User,EmailService,UserSession,{
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
  }]
})
export class EmailPageModule {}
