import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HolidayviewPage } from './holidayview.page';

const routes: Routes = [
  {
    path: '',
    component: HolidayviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HolidayviewPageRoutingModule {}
