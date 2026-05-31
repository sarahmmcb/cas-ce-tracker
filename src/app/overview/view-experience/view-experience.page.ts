import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { firstValueFrom, Subscription, tap } from 'rxjs';
import { AuthService } from '@app/auth/auth.service';
import { Experience, IUnit } from '@app/models/experience';
import { User } from '@app/models/user';
import { ExperienceService } from '@app/services/experience.service';
import { AddExperienceComponent } from '@app/overview/add-experience/add-experience.component';
import { ShortenTextPipe } from '@app/pipes/shorten-text.pipe';
import { CommonModule } from '@angular/common';
import { ICategory } from '@app/models/category';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ErrorComponent } from '@app/core/error/error.component';
import { StaticDataService } from '@app/services/static-data.service';
import { DateBlockComponent } from '@app/core/date-block/date-block.component';
import { LoadingService } from '@app/services/loading.service';
import { AlertService } from '@app/services/alert.service';
import { AlertButtonRole, AlertType } from '@app/models/alert';

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
    DateBlockComponent
]
})
export class ViewExperiencePage implements OnInit, OnDestroy {
  public experiences = signal<Experience[]>([]);
  public user = signal<User>(null);
  public units = signal<IUnit[]>([]);
  public categories = signal<ICategory[]>([]);;
  public year = signal(0);
  public loadingError = signal('');

  private experienceSub: Subscription;
  private userSub: Subscription;

  constructor(
    private experienceService: ExperienceService,
    private staticDataService: StaticDataService,
    private authService: AuthService,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private alertService: AlertService
  ) {}

  public ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.year.set(params['selectedYear'] || new Date().getFullYear())
    });

   this.userSub = this.authService.user.pipe(
      tap(user => this.initializeUserSpecificData(user)),
      tap(() => this.experienceSub = this.experienceService.experiences.subscribe(ex => {
        if (!ex || ex.length === 0) {
          this.loadingError.set('There are no experiences for the selected year. Why don\'t you add some?');
        }
        else {
          this.loadingError.set('');
          this.experiences.set(ex);
          this.assignUnitLabels();
        }
      }))
    ).subscribe();
  }

  public ionViewWillEnter(): void {
    this.loadingService.showLoadingControl();
    this.experienceService
      .getExperiences(
        this.year(),
        this.user().id,
        this.user().nationalStandard.nationalStandardId
      )
      .subscribe({
          next: () => this.loadingService.dismissLoadingControl(), 
          error: err => {
          this.loadingError.set('There was an error loading experience data. Please try again later.');
        }
      });
  }

  public ngOnDestroy(): void {
    if (this.experienceSub) {
      this.experienceSub.unsubscribe();
    }

    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  public async onEditCE(experience: Experience): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: AddExperienceComponent,
      componentProps: {
        experienceInput: experience
      },
    });

    return await modal.present();
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
          action: async () => await this.onDeleteConfirmed(experience.experienceId)
        },
        {
          text: 'No',
          role: AlertButtonRole.cancel,
          id: 'cancelDelete',
          action: () => {}
        }
      ]
    });
  }

  private async onDeleteConfirmed(experienceId: number) : Promise<any> {
    this.loadingService.showLoadingControl();
    const result = await firstValueFrom(this.experienceService.deleteExperience(experienceId));

    this.loadingService.dismissLoadingControl();

    var resultText = result ? "Experience successfully deleted" : "An error occurred, please try again later";

    this.alertService.showAlert({
      content: resultText,
      type: AlertType.info,
      buttons: [
        {
          text: 'Ok',
          role: AlertButtonRole.confirm,
          id: 'confirmDeleteResult',
          action: () => {}
        }
      ]
    });
  }

  private initializeUserSpecificData(user: User) {
    if (user != null) {
      this.user.set(user);
      const nationalStandardId = this.user().nationalStandard.nationalStandardId;

      this.staticDataService
        .getUnits(nationalStandardId)
        .subscribe({
          next: res => {
            this.units.set(res);
          },
          error: err => {
            this.loadingError.set('There was an error fetching user info. Please try again later.');
          }
        });
    } else {
      this.loadingError.set('User undefined! Please exit and retry.');
    }
  }

  // TODO: consider moving this to the backend
  private assignUnitLabels(): void {
    for (const exp of this.experiences()) {
      for (const am of exp.amounts) {
        if (!am.unitSingular || !am.unitPlural) {
          const unit = this.units().find((u) => u.unitId === am.unitId);
          am.unitPlural = unit.unitPlural;
          am.unitSingular = unit.unitSingular;
        }
      }
    }
  }
}
