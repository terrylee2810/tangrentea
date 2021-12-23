import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JxuserlistPage } from './jxuserlist.page';

const routes: Routes = [
  {
    path: '',
    component: JxuserlistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JxuserlistPageRoutingModule {}
