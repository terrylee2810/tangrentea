import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MasterproductPage } from './masterproduct.page';

const routes: Routes = [
  {
    path: '',
    component: MasterproductPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterproductPageRoutingModule {}
