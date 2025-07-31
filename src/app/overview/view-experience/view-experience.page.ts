import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { Subscription, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Experience, IUnit } from 'src/app/models/experience';
import { User } from 'src/app/models/user';
import { ExperienceService } from 'src/app/services/experience.service';
import { AddExperienceComponent } from '../add-experience/add-experience.component';
import { ShortenTextPipe } from 'src/app/pipes/shorten-text.pipe';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { ICategory } from 'src/app/models/category';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ErrorComponent } from 'src/app/core/error/error.component';
import { StaticDataService } from 'src/app/services/static-data.service';

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
      DatePipe,
      NgFor,
      NgIf,
      ErrorComponent
    ]
})
export class ViewExperiencePage implements OnInit, OnDestroy {
  public experiences: Experience[] = [];
  public user: User;
  public units: IUnit[] = [];
  public categories: ICategory[] = [];
  public year: number;
  public loadingError: string;

  private experienceSub: Subscription;
  private userSub: Subscription;

  constructor(
    private experienceService: ExperienceService,
    private staticDataService: StaticDataService,
    private authService: AuthService,
    private modalCtrl: ModalController,
    private route: ActivatedRoute
  ) {}

  /*************************
   * TODOs
   * 1. Message informing user if there are no experiences
   * 2. Ability to select different years
   *    a. Bonus if you can scroll through the years via side swiping
   * 3. Handle the case where the user is both USQS General and USQS Specific
   */
  public ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.year = params['selectedYear'] || new Date().getFullYear()
    });

   this.userSub = this.authService.user.pipe(
      tap(user => this.initializeUserSpecificData(user)),
      tap(() => this.experienceSub = this.experienceService.experiences.subscribe(ex => {
        if (!ex || ex.length === 0) {
          this.loadingError = "There are no experiences for the selected year. Why don't you add some?";
        }
        else {
          this.loadingError = "";
          this.experiences = ex;
          this.assignUnitLabels();
        }
      }))
    ).subscribe();
  }

  public ionViewWillEnter(): void {
    this.experienceService
      .getExperiences(
        this.year,
        this.user.id,
        this.user.nationalStandard.nationalStandardId
      )
      .subscribe({
          error: err => {
          this.loadingError = "There was an error loading experience data. Please try again later."
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
        experience
      },
    });

    return await modal.present();
  }

  private initializeUserSpecificData(user: User) {
    if (user != null) {
      this.user = user;
      const nationalStandardId = this.user.nationalStandard.nationalStandardId;

      this.staticDataService
        .getUnits(nationalStandardId)
        .subscribe({
          next: res => {
            this.units = res;
          },
          error: err => {
            this.loadingError = "There was an error fetching user info. Please try again later."
          }
        });
    } else {
      this.loadingError = "User undefined! Please exit and retry."
    }
  }

  // TODO: consider moving this to the backend
  private assignUnitLabels(): void {
    for (const exp of this.experiences) {
      for (const am of exp.amounts) {
        if (!am.unitSingular || !am.unitPlural) {
          const unit = this.units.find((u) => u.unitId === am.unitId);
          am.unitPlural = unit.unitPlural;
          am.unitSingular = unit.unitSingular;
        }
      }
    }
  }
}
