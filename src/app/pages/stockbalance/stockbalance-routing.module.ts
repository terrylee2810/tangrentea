import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockbalancePage } from './stockbalance.page';

const routes: Routes = [
  {
    path: '',
    component: StockbalancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockbalancePageRoutingModule {}
