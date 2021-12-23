import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AnnouncementPageRoutingModule } from './announcement-routing.module';
import { AnnouncementPage } from './announcement.page';
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
import { AnnouncementService } from 'src/app/services/announcement.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnnouncementPageRoutingModule,
    FontAwesomeModule,
    PerfectScrollbarModule,
    AgGridModule.withComponents([]),
  ],
  declarations: [AnnouncementPage],
  providers: [HttpsServices,ConfigManager,User,AnnouncementService,UserSession,{
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
  }]
})
export class AnnouncementPageModule {}
