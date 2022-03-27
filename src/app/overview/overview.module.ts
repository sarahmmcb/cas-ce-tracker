import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AddExperienceComponent } from './add-experience/add-experience.component';
import { ComplianceGraphicComponent } from './compliance-graphic/compliance-graphic.component';
import { OverviewPageRoutingModule } from './overview-routing.module';
import { OverviewPage } from './overview.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    OverviewPageRoutingModule
  ],
  declarations: [OverviewPage, ComplianceGraphicComponent, AddExperienceComponent]
})
export class OverviewPageModule {}
