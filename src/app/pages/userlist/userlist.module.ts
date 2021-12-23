import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserlistPageRoutingModule } from './userlist-routing.module';

import { UserlistPage } from './userlist.page';
import { HttpsServices } from 'src/app/services/https.service';
import { ConfigManager } from 'src/app/services/config.service';
import { PrivateMessage } from 'src/app/entity/PrivateMessage';
import { PrivateMsgService } from 'src/app/services/privatemsg.service';
import { UserSession } from 'src/app/entity/UserSession';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProductService } from 'src/app/services/product.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserlistPageRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  declarations: [UserlistPage],
  providers: [HttpsServices,ConfigManager,PrivateMessage,ProductService,UserSession],
})
export class UserlistPageModule {}
