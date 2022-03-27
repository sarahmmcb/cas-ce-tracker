import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DateTime } from 'luxon';
import { CEExperience } from 'src/app/models/experience';
import { ExperienceService } from 'src/app/services/experience.service';

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
   * Year to show CE for.
   */
  public year: number;

  constructor(private experienceService: ExperienceService,
              private modalCtrl: ModalController) { }

  /**
   * On init.
   */
  public ngOnInit(): void {
    this.year = DateTime.now().year;
    this.currentCE = this.experienceService.fetchExperiences(this.year);
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

}
