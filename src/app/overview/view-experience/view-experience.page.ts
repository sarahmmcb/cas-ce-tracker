import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DateTime } from 'luxon';
import { e } from 'mathjs';
import { CEExperience, CEUnit } from 'src/app/models/experience';
import { CEExperienceService } from 'src/app/services/experience.service';

import { AddExperienceComponent } from '../add-experience/add-experience.component';

@Component({
  selector: 'app-view-experience',
  templateUrl: './view-experience.page.html',
  styleUrls: ['./view-experience.page.scss'],
})
export class ViewExperiencePage implements OnInit {

  /**
   * List of ce.
   */
  public currentCE: CEExperience[] = [];

  /**
   * CE Unit info.
   */
  public ceUnits: CEUnit[] = [];

  /**
   * Year to show CE for.
   */
  public year: number;

  constructor(private experienceService: CEExperienceService,
              private modalCtrl: ModalController) { }

  /**
   * On Init.
   */
  public ngOnInit(): void {
    this.year = DateTime.now().year;
    // Should all this be done in the experience service?
    // follow bookings example in ionic course project
    this.ceUnits = this.experienceService.fetchUnitInfo();
    // this.experienceService.getExperiences(this.year).subscribe(res => {
    //   this.currentCE = res.body;
    //   this.assignUnits();
    // });
  }

  /**
   * Open modal to edit CE.
   */
  public async onEditCE(ceExperience: CEExperience): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: AddExperienceComponent,
      componentProps: {
        ceExperience
      }
    });

    return await modal.present();
  }

  /**
   * Assign unit labels to experience amounts.
   */
  private assignUnits(): void {
    // Use array methods here?
    for(const exp of this.currentCE) {
      for(const am of exp.amounts) {
        const unit = this.ceUnits.find(u => u.ceUnitId === am.ceUnitId);
        am.unitPlural = unit.unitPlural;
        am.unitSingular = unit.unitSingular;
      }
    }
  }

}
