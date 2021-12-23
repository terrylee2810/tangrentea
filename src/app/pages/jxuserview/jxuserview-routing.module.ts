import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JxuserviewPage } from './jxuserview.page';

const routes: Routes = [
  {
    path: '',
    component: JxuserviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JxuserviewPageRoutingModule {}
