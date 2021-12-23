import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RptdeliveryPage } from './rptdelivery.page';

const routes: Routes = [
  {
    path: '',
    component: RptdeliveryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RptdeliveryPageRoutingModule {}
