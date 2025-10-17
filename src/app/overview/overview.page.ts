import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { CEData } from '../models/cedata';
import { CEDataService } from '../services/cedata.service';
import { AddExperienceComponent } from './add-experience/add-experience.component';
import { UserService } from '../services/user.service';
import { ComplianceGraphicComponent } from './compliance-graphic/compliance-graphic.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ErrorStatus } from '../core/error/error';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.page.html',
    styleUrls: ['./overview.page.scss'],
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
  public showError = false;
  public errorMessage: string;
  private ceDataSub: Subscription;

  get selectedYear(): number {
    return this.userService.selectedYear;
  }

  constructor(
    private ceDataService: CEDataService,
    private modalCtrl: ModalController,
    private userService: UserService
  ) {}

  public ngOnInit(): void {
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
    this.ceDataService.getCEComplianceData(this.selectedYear).subscribe({
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
    this.userService.selectedYear = year;
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
      case ErrorStatus.NotFound:
        this.errorMessage = `No data found for ${this.selectedYear}`;
        break;
      default:
        this.errorMessage = 'An error occurred, please try again';
    }
  }
}
