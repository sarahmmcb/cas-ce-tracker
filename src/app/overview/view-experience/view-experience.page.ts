import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { IExperience, IUnit } from 'src/app/models/experience';
import { CEExperienceService } from 'src/app/services/experience.service';

import { AddExperienceComponent } from '../add-experience/add-experience.component';

@Component({
  selector: 'app-view-experience',
  templateUrl: './view-experience.page.html',
  styleUrls: ['./view-experience.page.scss'],
})
export class ViewExperiencePage implements OnInit, OnDestroy {
  public experiences: IExperience[] = [];
  public ceUnits: IUnit[] = [];
  public year: number;

  private experienceSub: Subscription;

  constructor(
    private experienceService: CEExperienceService,
    private modalCtrl: ModalController
  ) {}

  public ngOnInit(): void {
    // subscribe to the subject in the experience service
    this.experienceSub = this.experienceService.experiences.subscribe((ex) => {
      this.experiences = ex;
    });

    this.experienceService.fetchUnitInfo().subscribe((res) => {
      this.ceUnits = res;
    });
  }

  public ionViewWillEnter(): void {
    this.experienceService.getExperiences(this.year).subscribe((res) => {
      this.assignUnitLabels();
    });
  }

  public ngOnDestroy(): void {
    if (this.experienceSub) {
      this.experienceSub.unsubscribe();
    }
  }

  public async onEditCE(ceExperience: IExperience): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: AddExperienceComponent,
      componentProps: {
        ceExperience,
      },
    });

    return await modal.present();
  }

  private assignUnitLabels(): void {
    for (const exp of this.experiences) {
      for (const am of exp.amounts) {
        const unit = this.ceUnits.find((u) => u.unitId === am.unitId);
        am.unitPlural = unit.unitPlural;
        am.unitSingular = unit.unitSingular;
      }
    }
  }
}
