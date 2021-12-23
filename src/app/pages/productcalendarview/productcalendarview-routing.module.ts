import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductcalendarviewPage } from './productcalendarview.page';

const routes: Routes = [
  {
    path: '',
    component: ProductcalendarviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductcalendarviewPageRoutingModule {}
