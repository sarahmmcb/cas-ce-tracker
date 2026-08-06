import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core'
import { ModalController, IonicModule } from '@ionic/angular'
import { firstValueFrom, Observable, Subscription, switchMap, tap } from 'rxjs'
import { AuthService } from '@app/auth/auth.service'
import { Experience, IUnit } from '@app/models/experience'
import { User } from '@app/models/user'
import { ExperienceService } from '@app/services/experience.service'
import { AddExperienceComponent } from '@app/overview/add-experience/add-experience.component'
import { ShortenTextPipe } from '@app/pipes/shorten-text.pipe'
import { CommonModule } from '@angular/common'
import { ICategory } from '@app/models/category'
import { FormsModule } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { ErrorComponent } from '@app/core/error/error.component'
import { DateBlockComponent } from '@app/core/date-block/date-block.component'
import { LoadingService } from '@app/services/loading.service'
import { AlertService } from '@app/services/alert.service'
import { AlertButtonRole, AlertType } from '@app/models/alert'
import { FooterComponent } from '@app/core/footer/footer.component'

@Component({
  selector: 'app-view-experience',
  templateUrl: './view-experience.page.html',
  styleUrls: ['./view-experience.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShortenTextPipe,
    ErrorComponent,
    DateBlockComponent,
    FooterComponent,
  ],
})
export class ViewExperiencePage implements OnInit, OnDestroy {
  public experiences = signal<Experience[]>([])
  public user = signal<User>(null)
  public units = signal<IUnit[]>([])
  public categories = signal<ICategory[]>([])
  public year = signal(0)
  public loadingError = signal('')

  private experienceSub: Subscription

  private experienceService = inject(ExperienceService)
  private authService = inject(AuthService)
  private modalCtrl = inject(ModalController)
  private route = inject(ActivatedRoute)
  private loadingService = inject(LoadingService)
  private alertService = inject(AlertService)

  public ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.year.set(params['selectedYear'] || new Date().getFullYear())
    })

    this.user.set(this.authService.user)

    this.experienceSub = this.experienceService.experiences.subscribe((ex) => {
      if (!ex || ex.length === 0) {
        this.loadingError.set(
          "There are no experiences for the selected year. Why don't you add some?",
        )
      } else {
        this.loadingError.set('')
        this.experiences.set(ex)
      }
    })

    this.loadingService.showLoadingControl()

    this.experienceService
      .getExperiences(this.year(), this.user().id, this.user().nationalStandard.nationalStandardId)
      .subscribe({
        error: (err) => {
          this.loadingError.set(
            'There was an error loading experience data. Please try again later.',
          )
          this.loadingService.dismissLoadingControl()
        },
        complete: () => this.loadingService.dismissLoadingControl(),
      })
  }

  public ngOnDestroy(): void {
    if (this.experienceSub) {
      this.experienceSub.unsubscribe()
    }
  }

  public async onEditCE(experience: Experience): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: AddExperienceComponent,
      componentProps: {
        experienceInput: experience,
      },
    })

    return await modal.present()
  }

  public async onDeleteCE(experience: Experience): Promise<void> {
    this.alertService.showAlert({
      title: 'Delete Experience',
      content: 'Are you sure you want to delete this experience and all of its associated data?',
      type: AlertType.confirm,
      buttons: [
        {
          text: 'Yes',
          role: AlertButtonRole.confirm,
          id: 'confirmDelete',
          action: async () => await this.onDeleteConfirmed(experience.experienceId),
        },
        {
          text: 'No',
          role: AlertButtonRole.cancel,
          id: 'cancelDelete',
          action: () => {},
        },
      ],
    })
  }

  private async onDeleteConfirmed(experienceId: number): Promise<any> {
    this.loadingService.showLoadingControl()
    const result = await firstValueFrom(this.experienceService.deleteExperience(experienceId))

    this.loadingService.dismissLoadingControl()

    var resultText = result
      ? 'Experience successfully deleted'
      : 'An error occurred, please try again later'

    this.alertService.showAlert({
      content: resultText,
      type: AlertType.info,
      buttons: [
        {
          text: 'Ok',
          role: AlertButtonRole.confirm,
          id: 'confirmDeleteResult',
          action: () => {},
        },
      ],
    })
  }
}
