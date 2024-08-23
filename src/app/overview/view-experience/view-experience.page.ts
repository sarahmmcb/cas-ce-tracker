import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Experience, IUnit } from 'src/app/models/experience';
import { CEUser } from 'src/app/models/user';
import { ExperienceService } from 'src/app/services/experience.service';
import { AddExperienceComponent } from '../add-experience/add-experience.component';
import { ShortenTextPipe } from 'src/app/pipes/shorten-text.pipe';
import { NgFor, NgIf } from '@angular/common';
import { ICategory } from 'src/app/models/category';

@Component({
    selector: 'app-view-experience',
    templateUrl: './view-experience.page.html',
    styleUrls: ['./view-experience.page.scss'],
    standalone: true,
    imports: [IonicModule, NgFor, NgIf, ShortenTextPipe]
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
    private modalCtrl: ModalController
  ) {}

  /*************************
   * TODOs
   * 1. Message informing user if there are no experiences
   * 2. Ability to select different years
   *    a. Bonus if you can scroll through the years via side swiping
   * 3. Handle the case where the user is both USQS General and USQS Specific
   */
  public ngOnInit(): void {
    // subscribe to the subject in the experience service
    this.year = new Date().getFullYear();
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

  public async onEditCE(ceExperience: Experience): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: AddExperienceComponent,
      componentProps: {
        ceExperience,
      },
    });

    return await modal.present();
  }

  private initializeUserSpecificData(user: CEUser) {
    if (user != null) {
      this.user = user;
      const nationalStandardId = this.user.nationalStandard.nationalStandardId;

      // TODO: fetch this on app startup and store it in the service
      // because it only needs to be fetched once

      this.experienceService
        .getUnits(nationalStandardId)
        .subscribe((res) => {
          this.units = res;
        });

      // TODO: fetch categories

    } else {
      // TODO: show an error message stating something is wrong
    }
  }

  private assignUnitLabels(): void {
    // TODO: check if this.experiences is hydrated - show msg if none
    for (const exp of this.experiences) {
      for (const am of exp.experienceAmounts) {
        const unit = this.units.find((u) => u.unitId === am.unitId);
        am.unitPlural = unit.unitPlural;
        am.unitSingular = unit.unitSingular;
      }
    }
  }

  private assignCategoryNames(): void {
    for (const exp of this.experiences) {
      for (const category of exp.experienceCategories) {
        const cat = this.categories.find(c => c.categoryId === category.categoryId);
        category.displayName = cat.displayName;
      }
    }
  }
}
