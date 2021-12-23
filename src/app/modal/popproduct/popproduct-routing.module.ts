import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopproductPage } from './popproduct.page';

const routes: Routes = [
  {
    path: '',
    component: PopproductPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopproductPageRoutingModule {}
