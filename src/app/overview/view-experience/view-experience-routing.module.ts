import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewExperiencePage } from './view-experience.page';

const routes: Routes = [
  {
    path: '',
    component: ViewExperiencePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewExperiencePageRoutingModule {}
