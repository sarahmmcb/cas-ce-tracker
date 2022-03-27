import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { CEData } from '../models/cedata';
import { CEDataService } from '../services/cedata.service';
import { AddExperienceComponent } from './add-experience/add-experience.component';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage implements OnInit {

  /**
   * CEData object.
   */
  public ceData: CEData;

  constructor(private ceDataService: CEDataService,
              private modalCtrl: ModalController) { }

  /**
   * On Init.
   */
  public ngOnInit(): void {
    // subscribe to CEData in ceDataService
    this.ceData = this.ceDataService.getCEComplianceData();
  }

  /**
   * Open modal for adding CE.
   */
  public async onAddCE(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: AddExperienceComponent
    });

    return await modal.present();
  }

}
