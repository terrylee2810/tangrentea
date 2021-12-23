import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmailverificationPage } from './emailverification.page';

const routes: Routes = [
  {
    path: '',
    component: EmailverificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailverificationPageRoutingModule {}
