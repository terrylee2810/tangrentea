import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostcodePage } from './postcode.page';

const routes: Routes = [
  {
    path: '',
    component: PostcodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostcodePageRoutingModule {}
