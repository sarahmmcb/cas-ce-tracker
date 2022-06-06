import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { CEData } from '../models/cedata';
import { CEDataService } from '../services/cedata.service';
import { AddExperienceComponent } from './add-experience/add-experience.component';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage implements OnInit, OnDestroy {

  public ceData: CEData = new CEData();
  private ceDataSub: Subscription;

  constructor(private ceDataService: CEDataService,
              private modalCtrl: ModalController) { }

  public ngOnInit(): void {
    this.ceDataSub = this.ceDataService.ceData.subscribe(ceData => {
      this.ceData = ceData;
    });
  }

  public ionViewWillEnter(): void {
    this.ceDataService.getCEComplianceData().subscribe();
  }

  public ngOnDestroy(): void {
    if(this.ceDataSub) {
      this.ceDataSub.unsubscribe();
    }
  }

  public async onAddCE(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: AddExperienceComponent
    });

    return await modal.present();
  }

}
