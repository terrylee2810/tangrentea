import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmailverificationPage } from './emailverification.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EmailverificationPageRoutingModule } from './emailverification-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmailverificationPageRoutingModule,
    FontAwesomeModule
  ],
  declarations: [EmailverificationPage]
})
export class EmailverificationPageModule {}
