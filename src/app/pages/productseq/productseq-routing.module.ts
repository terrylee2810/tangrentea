import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductseqPage } from './productseq.page';

const routes: Routes = [
  {
    path: '',
    component: ProductseqPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductseqPageRoutingModule {}
