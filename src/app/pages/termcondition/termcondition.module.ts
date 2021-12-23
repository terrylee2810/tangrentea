import { NgModule, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TermconditionPageRoutingModule } from './termcondition-routing.module';

import { TermconditionPage } from './termcondition.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TermconditionPageRoutingModule,
    FontAwesomeModule
  ],
  declarations: [TermconditionPage],

})
export class TermconditionPageModule {}
