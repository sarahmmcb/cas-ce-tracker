import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
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
  public year: number;
  public showError = false;
  public errorMessage: string;
  private ceDataSub: Subscription;

  constructor(
    private ceDataService: CEDataService,
    private modalCtrl: ModalController
  ) {}

  public ngOnInit(): void {
    this.year = new Date().getFullYear();
    this.ceDataSub = this.ceDataService.ceData.subscribe(
      (ceData) => {
        this.ceData = ceData;
      },
      (error) => {
        this.showError = true;
        this.handleError(error);
      }
    );
  }

  public ionViewWillEnter(): void {
    this.ceDataService.getCEComplianceData(this.year).subscribe();
  }

  public ngOnDestroy(): void {
    if (this.ceDataSub) {
      this.ceDataSub.unsubscribe();
    }
  }

  public async onAddCE(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: AddExperienceComponent,
    });

    return await modal.present();
  }

  private handleError(error: HttpErrorResponse): void {
    const status = getErrorStatus(error);
    switch (status) {
      case 404: // TODO: define these constants in a separate
        this.errorMessage = `No data found for ${this.year}`;
        break;
      default:
        this.errorMessage = 'An error occurred, please try again';
    }
  }
}
