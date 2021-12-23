import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactusPageRoutingModule } from './contactus-routing.module';

import { ContactusPage } from './contactus.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ConfigManager } from 'src/app/services/config.service';
import { HttpsServices } from 'src/app/services/https.service';

import { ContactUs } from 'src/app/entity/ContactUs';
import { PrivateMsgService } from 'src/app/services/privatemsg.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactusPageRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  declarations: [ContactusPage],
  providers: [HttpsServices,ConfigManager,ContactUs,PrivateMsgService],
})

export class ContactusPageModule {}
