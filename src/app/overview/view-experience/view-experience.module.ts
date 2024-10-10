import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ShortenTextPipe } from 'src/app/pipes/shorten-text.pipe';
import { DatePipe } from '@angular/common';

import { ViewExperiencePageRoutingModule } from './view-experience-routing.module';
import { ViewExperiencePage } from './view-experience.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ViewExperiencePageRoutingModule,
        ViewExperiencePage,
        ShortenTextPipe,
        DatePipe
    ]
})
export class ViewExperiencePageModule {}
