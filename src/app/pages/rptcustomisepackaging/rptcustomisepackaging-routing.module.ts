import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RptcustomisepackagingPage } from './rptcustomisepackaging.page';

const routes: Routes = [
  {
    path: '',
    component: RptcustomisepackagingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RptcustomisepackagingPageRoutingModule {}
