import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { CEData } from '../models/cedata';
import { CEDataService } from '../services/cedata.service';
import { AddExperienceComponent } from './add-experience/add-experience.component';
import { ErrorCodes } from '../utils/errors';
import { UserService } from '../services/user.service';
import { ComplianceGraphicComponent } from './compliance-graphic/compliance-graphic.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.page.html',
    styleUrls: ['./overview.page.scss'],
    standalone: true,
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      IonicModule,
      RouterModule,
      ComplianceGraphicComponent
    ]
})
export class OverviewPage implements OnInit, OnDestroy {
  public ceData: CEData = new CEData();
  public year: number;
  public showError = false;
  public errorMessage: string;
  private ceDataSub: Subscription;

  constructor(
    private ceDataService: CEDataService,
    private modalCtrl: ModalController,
    private userService: UserService
  ) {}

  public ngOnInit(): void {
    this.year = this.userService.year; // TODO: Do we still need year held in user service?
    this.ceDataSub = this.ceDataService.ceData.subscribe({
        next: (ceData) => {
          this.ceData = ceData;
          this.errorMessage = '';
        },
        error: (error) => {
          this.handleError(error);
          this.showError = true;
        }
      }
    );
  }

  public ionViewWillEnter(): void {
    this.ceDataService.getCEComplianceData(this.year).subscribe({
        next: () => {},
        error: (error) => {
          this.handleError(error);
          this.showError = true;
        }
      }
    );
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

  public updateYear(year: number) {
    this.year = year;
    this.ceDataService.getCEComplianceData(year).subscribe({
        next: () => {},
        error: (error) => {
          this.handleError(error);
          this.showError = true;
        }
      }
    );
  }

  private handleError(error: HttpErrorResponse): void {
    const status = error.status;
    switch (status) {
      case ErrorCodes.NotFound:
        this.errorMessage = `No data found for ${this.year}`;
        break;
      default:
        this.errorMessage = 'An error occurred, please try again';
    }
  }
}
