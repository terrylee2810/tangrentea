
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EmailviewPageRoutingModule } from './emailview-routing.module';
import { EmailviewPage } from './emailview.page';
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
import { EmailService } from 'src/app/services/email.service';
import { Email } from 'src/app/entity/Email';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmailviewPageRoutingModule,
    FontAwesomeModule,
    PerfectScrollbarModule,
  ],
  declarations: [EmailviewPage],
  providers: [HttpsServices,ConfigManager,UserService,Email,EmailService,UserSession,{
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
  }]
})
export class EmailviewPageModule {}
