import { Postcode } from 'src/app/entity/Postcode';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PostcodeviewPageRoutingModule } from './postcodeview-routing.module';
import { PostcodeviewPage } from './postcodeview.page';
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

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostcodeviewPageRoutingModule,
    FontAwesomeModule,
    PerfectScrollbarModule,
  ],
  declarations: [PostcodeviewPage],
  providers: [HttpsServices,ConfigManager,UserService,Postcode,PostcodeService,UserSession,{
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
  }]
})
export class PostcodeviewPageModule {}
