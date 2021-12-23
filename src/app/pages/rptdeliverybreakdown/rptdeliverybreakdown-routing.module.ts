import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RptdeliverybreakdownPage } from './rptdeliverybreakdown.page';

const routes: Routes = [
  {
    path: '',
    component: RptdeliverybreakdownPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RptdeliverybreakdownPageRoutingModule {}
