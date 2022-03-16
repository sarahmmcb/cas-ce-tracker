import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComplianceGraphicComponent } from './compliance-graphic/compliance-graphic.component';
import { OverviewPageRoutingModule } from './overview-routing.module';
import { OverviewPage } from './overview.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OverviewPageRoutingModule
  ],
  declarations: [OverviewPage, ComplianceGraphicComponent]
})
export class OverviewPageModule {}
