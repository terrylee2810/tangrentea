import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemberprofilePage } from './memberprofile.page';

const routes: Routes = [
  {
    path: '',
    component: MemberprofilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemberprofilePageRoutingModule {}
