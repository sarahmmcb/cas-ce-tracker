import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Experience, IUnit } from 'src/app/models/experience';
import { CEUser } from 'src/app/models/user';
import { ExperienceService } from 'src/app/services/experience.service';
import { AddExperienceComponent } from '../add-experience/add-experience.component';
import { ShortenTextPipe } from 'src/app/pipes/shorten-text.pipe';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { ICategory } from 'src/app/models/category';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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
      NgIf
    ]
})
export class ViewExperiencePage implements OnInit, OnDestroy {
  public experiences: Experience[] = [];
  public user: CEUser;
  public units: IUnit[] = [];
  public categories: ICategory[] = [];
  public year: number;

  private experienceSub: Subscription;
  private userSub: Subscription;

  constructor(
    private experienceService: ExperienceService,
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
    // subscribe to the subject in the experience service
    this.experienceSub = this.experienceService.experiences.subscribe((ex) => {
      this.experiences = ex;
    });

    // subscribe to the user subject from auth service
    this.userSub = this.authService.user.subscribe((user) =>
      this.initializeUserSpecificData(user)
    );
  }

  public ionViewWillEnter(): void {
    this.experienceService
      .getExperiences(
        this.year,
        this.user.userId,
        this.user.nationalStandard.nationalStandardId
      )
      .subscribe((res) => {
        this.assignUnitLabels();
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
        experience,
      },
    });

    return await modal.present();
  }

  private initializeUserSpecificData(user: CEUser) {
    if (user != null) {
      this.user = user;
      const nationalStandardId = this.user.nationalStandard.nationalStandardId;

      this.experienceService
        .getUnits(nationalStandardId)
        .subscribe(res => {
          this.units = res;
        });
    } else {
      // TODO: show an error message stating something is wrong
    }
  }

  private assignUnitLabels(): void {
    // TODO: check if this.experiences is hydrated - show msg if none
    for (const exp of this.experiences) {
      for (const am of exp.amounts) {
        const unit = this.units.find((u) => u.unitId === am.unitId);
        am.unitPlural = unit.unitPlural;
        am.unitSingular = unit.unitSingular;
      }
    }
  }
}
