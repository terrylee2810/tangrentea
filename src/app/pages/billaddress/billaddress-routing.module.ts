import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BilladdressPage } from './billaddress.page';

const routes: Routes = [
  {
    path: '',
    component: BilladdressPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BilladdressPageRoutingModule {}
