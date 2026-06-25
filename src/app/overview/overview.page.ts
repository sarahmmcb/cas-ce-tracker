import { HttpErrorResponse } from '@angular/common/http'
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core'
import { IonicModule } from '@ionic/angular'
import { Subscription } from 'rxjs'

import { CEData } from '../models/cedata'
import { CEDataService } from '../services/cedata.service'
import { UserService } from '../services/user.service'
import { LoadingService } from '../services/loading.service'
import { ComplianceGraphicComponent } from './compliance-graphic/compliance-graphic.component'

import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { ErrorStatus } from '../core/error/error'
import { FooterComponent } from '@app/core/footer/footer.component'
import { AuthService } from '@app/auth/auth.service'

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
    ComplianceGraphicComponent,
    FooterComponent,
  ],
})
export class OverviewPage implements OnInit, OnDestroy {
  public ceData = signal<CEData>({} as CEData)
  public displayedCeData: CEData = new CEData()
  public showError = signal(false)
  public errorMessage = signal<string>(undefined)
  private ceDataSub: Subscription

  public minYear = 2022

  public allYears = signal<number[]>([])

  get selectedYear(): number {
    return this.userService.selectedYear
  }

  private ceDataService = inject(CEDataService)
  private authService = inject(AuthService)
  private userService = inject(UserService)
  private loadingService = inject(LoadingService)

  public ngOnInit(): void {
    this.allYears.set(
      Array.from(
        { length: new Date().getFullYear() - this.minYear + 1 },
        (_, i) => i + this.minYear,
      ),
    )

    this.ceDataSub = this.ceDataService.ceData.subscribe({
      next: (ceData) => {
        if (!ceData || !ceData.categoryData || !ceData.categoryData.length) {
          this.errorMessage.set(`Couldn't Find Any CE Data for ${this.selectedYear}`)
          this.showError.set(true)
        } else {
          this.ceData.set(ceData)
          this.showError.set(false)
        }
      },
      error: (error) => {
        this.handleError(error)
        this.showError.set(true)
      },
    })
  }

  public ionViewWillEnter(): void {
    if (this.authService.user) {
      this.loadingService.showLoadingControl()
      this.ceDataService
        .getCEComplianceData(
          this.selectedYear,
          this.authService.user.id,
          this.authService.user.nationalStandard.nationalStandardId,
        )
        .subscribe({
          next: () => {
            this.loadingService.dismissLoadingControl()
          },
          error: (error) => {
            this.handleError(error)
            this.showError.set(true)
          },
        })
    }
  }

  public ngOnDestroy(): void {
    if (this.ceDataSub) {
      this.ceDataSub.unsubscribe()
    }
  }

  public updateYear(event: any) {
    const year = event.detail.value
    this.userService.selectedYear = year
    this.ceDataService
      .getCEComplianceData(
        year,
        this.authService.user.id,
        this.authService.user.nationalStandard.nationalStandardId,
      )
      .subscribe({
        next: () => {},
        error: (error) => {
          this.handleError(error)
          this.showError.set(true)
        },
      })
  }

  private handleError(error: HttpErrorResponse): void {
    this.loadingService.dismissLoadingControl()
    const status = error.status
    switch (status) {
      case ErrorStatus.NotFound:
        this.errorMessage.set(`No data found for ${this.selectedYear}`)
        break
      default:
        this.errorMessage.set('An error occurred, please try again')
    }
  }
}
