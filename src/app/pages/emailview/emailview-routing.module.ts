import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmailviewPage } from './emailview.page';

const routes: Routes = [
  {
    path: '',
    component: EmailviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailviewPageRoutingModule {}
