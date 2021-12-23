import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderOnlinePage } from './orderonline.page';

const routes: Routes = [
  {
    path: '',
    component: OrderOnlinePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderOnlinePageRoutingModule {}
