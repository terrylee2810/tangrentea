import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AnnouncementviewPageRoutingModule } from './announcementview-routing.module';
import { AnnouncementviewPage } from './announcementview.page';
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
import { Announcement } from 'src/app/entity/Announcement';
import { AnnouncementService } from 'src/app/services/announcement.service';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnnouncementviewPageRoutingModule,
    FontAwesomeModule,
    PerfectScrollbarModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  declarations: [AnnouncementviewPage],
  providers: [HttpsServices,ConfigManager,UserService,Announcement,AnnouncementService,UserSession,{
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
  }]
})
export class AnnouncementviewPageModule {}
