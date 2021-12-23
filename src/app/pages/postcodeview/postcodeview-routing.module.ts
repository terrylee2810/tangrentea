import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostcodeviewPage } from './postcodeview.page';

const routes: Routes = [
  {
    path: '',
    component: PostcodeviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostcodeviewPageRoutingModule {}
