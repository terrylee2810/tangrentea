import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JxorderlistPage } from './jxorderlist.page';

const routes: Routes = [
  {
    path: '',
    component: JxorderlistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JxorderlistPageRoutingModule {}
