import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShipaddressPage } from './shipaddress.page';

const routes: Routes = [
  {
    path: '',
    component: ShipaddressPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShipaddressPageRoutingModule {}
