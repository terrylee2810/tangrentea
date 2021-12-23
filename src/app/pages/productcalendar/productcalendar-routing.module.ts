import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductcalendarPage } from './productcalendar.page';

const routes: Routes = [
  {
    path: '',
    component: ProductcalendarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductcalendarPageRoutingModule {}
