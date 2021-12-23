import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Checkout2Page } from './checkout2.page';

const routes: Routes = [
  {
    path: '',
    component: Checkout2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Checkout2PageRoutingModule {}
