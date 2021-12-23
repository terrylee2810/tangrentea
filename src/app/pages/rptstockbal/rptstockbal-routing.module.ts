import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RptstockbalPage } from './rptstockbal.page';

const routes: Routes = [
  {
    path: '',
    component: RptstockbalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RptstockbalPageRoutingModule {}
