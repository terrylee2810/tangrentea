import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RptdeliverysummaryPage } from './rptdeliverysummary.page';

const routes: Routes = [
  {
    path: '',
    component: RptdeliverysummaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RptdeliverysummaryPageRoutingModule {}
