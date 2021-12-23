import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistermemberPage } from './registermember.page';

const routes: Routes = [
  {
    path: '',
    component: RegistermemberPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistermemberPageRoutingModule {}
