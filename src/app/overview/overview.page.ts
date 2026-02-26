import { HttpErrorResponse } from '@angular/common/http';
<<<<<<< Updated upstream
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
=======
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
>>>>>>> Stashed changes
import { Subscription } from 'rxjs';

import { CEData } from '../models/cedata';
import { CEDataService } from '../services/cedata.service';
import { UserService } from '../services/user.service';
import { ComplianceGraphicComponent } from './compliance-graphic/compliance-graphic.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ErrorStatus } from '../core/error/error';
import { LoadingService } from '../services/loading.service';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.page.html',
    styleUrls: ['./overview.page.scss'],
    standalone: true,
    imports: [
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule,
    ComplianceGraphicComponent
  ]
})
export class OverviewPage implements OnInit, OnDestroy {
  public ceData: CEData = {} as CEData;
  public displayedCeData : CEData = new CEData();
  public showError = signal(false);
  public errorMessage: string;
  private ceDataSub: Subscription;
  
  public minYear = 2022;

  public allYears: number[];

  get selectedYear(): number {
    return this.userService.selectedYear;
  }

  constructor(
    private ceDataService: CEDataService,
<<<<<<< Updated upstream
    private userService: UserService,
    private loadingService: LoadingService
=======
    private userService: UserService
>>>>>>> Stashed changes
  ) {}

  public ngOnInit(): void {
    this.allYears = Array.from(
      { length: (new Date()).getFullYear() - this.minYear + 1 },
      (_, i) => i + this.minYear
    );

    this.ceDataSub = this.ceDataService.ceData.subscribe({
        next: (ceData) => {
          if (!ceData || !ceData.categoryData || !ceData.categoryData.length) {
            this.errorMessage = `Couldn't Find Any CE Data for ${this.selectedYear}`;
            this.showError.set(true);
          }
          else {
            this.ceData = ceData;
            this.showError.set(false);
          }
        },
        error: (error) => {
          this.handleError(error);
          this.showError.set(true);
        }
      }
    );
  }

  public ionViewWillEnter(): void {
   // this.loadingService.showLoadingControl();
    this.ceDataService.getCEComplianceData(
      this.selectedYear,
      this.userService.user.id,
      this.userService.user.nationalStandard.nationalStandardId
    ).subscribe({
        next: () => {
          //this.loadingService.dismissLoadingControl();
        },
        error: (error) => {
          this.handleError(error);
          this.showError.set(true);
        }
      }
    );
  }

  public ngOnDestroy(): void {
    if (this.ceDataSub) {
      this.ceDataSub.unsubscribe();
    }
  }

  public updateYear(event: any) {
    const year = event.detail.value;
    this.userService.selectedYear = year;
    this.ceDataService.getCEComplianceData(
      year,
      this.userService.user.id,
      this.userService.user.nationalStandard.nationalStandardId
    ).subscribe({
        next: () => {},
        error: (error) => {
          this.handleError(error);
          this.showError.set(true);
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
