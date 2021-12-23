import { Postcode } from 'src/app/entity/Postcode';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { JxuserviewPageRoutingModule } from './jxuserview-routing.module';
import { JxuserviewPage } from './jxuserview.page';
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
import { PostcodeService } from 'src/app/services/postcode.service'; 
import { User } from 'src/app/entity/User';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JxuserviewPageRoutingModule,
    FontAwesomeModule,
    PerfectScrollbarModule,
  ],
  declarations: [JxuserviewPage],
  providers: [HttpsServices,ConfigManager,UserService,UserSession,User ,{
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
  }]
})
export class JxuserviewPageModule {}
