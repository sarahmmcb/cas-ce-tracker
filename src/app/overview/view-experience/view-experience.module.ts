import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewExperiencePageRoutingModule } from './view-experience-routing.module';

import { ViewExperiencePage } from './view-experience.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewExperiencePageRoutingModule
  ],
  declarations: [ViewExperiencePage]
})
export class ViewExperiencePageModule {}
