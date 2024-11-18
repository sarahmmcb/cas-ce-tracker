import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputCustomEvent, LoadingController, ModalController, IonicModule } from '@ionic/angular';
import { DateTime } from 'luxon';
import * as math from 'mathjs';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { CEAlertService } from 'src/app/core/alert.service';
import { ICategoryList } from 'src/app/models/category';
import {
  Experience,
  ExperienceAmount,
  IExperienceCategory,
  IUnit,
  IUpdateExperience,
} from 'src/app/models/experience';
import { Location } from 'src/app/models/location';
import { CEUser } from 'src/app/models/user';
import { ExperienceService } from 'src/app/services/experience.service';

import { positiveValueValidator } from './validators';
import { UserService } from 'src/app/services/user.service';
import { NgIf, NgClass, NgFor, NgTemplateOutlet } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomHttpInterceptorService } from 'src/app/app.interceptor';

@Component({
    selector: 'app-add-experience',
    templateUrl: './add-experience.component.html',
    styleUrls: ['./add-experience.component.scss'],
    standalone: true,
    imports: [IonicModule, NgIf, FormsModule, ReactiveFormsModule, NgClass, NgFor, NgTemplateOutlet],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptorService }]

})
export class AddExperienceComponent implements OnInit, OnDestroy {

  @Input()
  public experience: Experience;
  public formTitle: string;
  public categoryLists: ICategoryList[] = [];
  public locations: Location[] = [];
  public ceUnits: IUnit[] = [];
  public parentUnit: IUnit;
  public childUnit: IUnit;
  public addForm: FormGroup;
  public submitted = false;
  public parentAmount: ExperienceAmount;
  // Time spent in the standard's accepted unit, as calculated from the parent unit.
  public childAmount: ExperienceAmount;
  public carryForwardYear: number;
  public isLoading = false;
  public fetchError: string;
  public user: CEUser;

  private loading: HTMLIonLoadingElement;
  private userSub: Subscription;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private experienceService: ExperienceService,
    private alertService: CEAlertService,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private userService: UserService
  ) {}

  // Helper method to access category form group in the template.
  public get categories(): FormArray {
    return this.addForm.get('categories') as FormArray; // TODO: check if this is actually being used
  }

  public ngOnInit(): void {
    // subscribe to the user subject from auth service
    this.userSub = this.authService.user.subscribe((user) => {
      this.user = user;
      this.fetchData();
    });
  }

  public ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  public onCancel(): Promise<boolean> | void {
    // present confirmation modal
    if (this.addForm && this.addForm.dirty) {
      // define alert here and add modalCtrl.dismiss() to button handler
      this.alertService.showAlert({
        title: 'Confirm',
        content: 'Are you you want to quit? Your changes will not be saved.',
        type: 'confirm',
        buttons: [
          {
            text: 'OK',
            role: 'confirm',
            id: 'confirmButton',
            action: () => this.modalCtrl.dismiss(),
          },
          {
            text: 'Cancel',
            role: 'cancel',
            id: 'cancelButton',
            action: () => {},
          },
        ],
      });
    } else {
      this.modalCtrl.dismiss();
    }
  }

  public onSubmit(): void {
    this.submitted = true;
    if (!this.addForm.valid) {
      return;
    }

    // send to server and return with updated experience object.
    if (this.experience.experienceId === 0) {
      this.experienceService
        .createExperience(this.prepareExperienceData())
        .subscribe();
    } else {
      this.experienceService
        .createExperience(this.prepareExperienceData())
        .subscribe();
    }

    this.modalCtrl.dismiss();
  }

  public onAmountEdit(event: InputCustomEvent): void {
    if (!event.target.value) {
      return;
    }

    this.addForm.patchValue({
      timeSpentChild: math.evaluate(
        event.target.value.toString() + this.childUnit.conversionFormula
      ),
    });
  }

  // TODO: construct this object correctly to match the form the server
  // is expecting
  private prepareExperienceData(): IUpdateExperience {
    return {
      ...this.addForm.value,
      experienceId: this.experience.experienceId,
      categories: [...this.addForm.value.categories],
      timeSpentChild: {
        experienceId: this.experience.experienceId,
        unitId: this.childUnit.unitId,
        amount: this.addForm.value.timeSpentChild
      },
      timeSpentParent: {
        experienceId: this.experience.experienceId,
        unitId: this.parentUnit.unitId,
        amount: this.addForm.value.timeSpentParent
      }
    };
  }

  private async fetchData() {
    this.isLoading = true;
    this.loading = await this.loadingCtrl.create({
      message: 'Loading form data',
    });
    await this.loading.present();

    // TODO: figure out how to cache these
    const dataCalls = forkJoin({
      getCategoryLists: this.experienceService.fetchCategoryLists(
        this.user.nationalStandard.nationalStandardId,
        this.userService.year
      ),
      getLocations: this.experienceService.fetchLocations(),
      getUnitInfo: this.experienceService.getUnits(
        this.user.nationalStandard.nationalStandardId
      ),
    }).pipe(catchError((error) => of(error)));

    dataCalls.subscribe(async (res) => {
      if (res.errorMessage) {
        this.formTitle = 'Experience Form';
        this.fetchError =
          'There was a problem fetching the form data. Please try again later.';
      } else {
        this.categoryLists = res.getCategoryLists;
        this.locations = res.getLocations;
        this.ceUnits = res.getUnitInfo;

        this.initializeData();
      }

      await this.loading.dismiss();
      this.isLoading = false;
    });
  }

  private initializeData(): void {
    this.initializeUnits();
    this.initializeExperienceData();
    this.initializeFormControls();

    this.formTitle =
      this.experience.experienceId !== 0 ? 'Update CE' : 'Add CE';
    this.isLoading = false;
  }

  private initializeUnits() {
    this.parentUnit = this.ceUnits.find((u) => u.parentUnitId === 0);
    this.childUnit = this.ceUnits.find((u) => u.parentUnitId !== 0);
  }

  private initializeExperienceData(): void {
    if (!this.experience) {
      this.experience = new Experience();
    }

    this.carryForwardYear =
      DateTime.fromSQL(this.experience.startDate).plus({
        years: 1,
      }).year || new Date().getFullYear() + 1;

    this.parentAmount =
      this.experience.amounts.find(
        (p) => p.unitId === this.parentUnit.unitId
      ) || new ExperienceAmount();

    this.childAmount =
      this.experience.amounts.find(
        (p) => p.unitId === this.childUnit.unitId
      ) || new ExperienceAmount();
  }

  private initializeFormControls(): void {
    this.addForm = this.fb.group({
      startDate: [this.experience.startDate, Validators.required],
      locationId: this.experience.location.locationId,
      programTitle: [this.experience.programTitle, Validators.required],
      eventName: this.experience.eventName,
      description: this.experience.description,
      timeSpentParent: [
        this.parentAmount.amount,
        [Validators.required, positiveValueValidator()],
      ],
      timeSpentChild: new FormControl({
        value: this.childAmount.amount,
        disabled: this.childUnit?.isDisabled,  // TODO: make sure this is working
      }),
      carryForward: this.experience.carryForward,
      notes: this.experience.notes,
      categories: this.fb.array([]),
    });

    // Add categorylist controls
    for (const catList of this.categoryLists) {
      const chosenCategory: IExperienceCategory = this.experience.categories.find(
        (c) => c.categoryListId === catList.categoryListId
      );

      if (chosenCategory) {
        // if we are updating, prepopulate with existing data.
        this.categories.push(
          new FormControl(chosenCategory.categoryId, [Validators.required])
        );
      } else {
        this.categories.push(new FormControl(null, [Validators.required]));
      }
    }
  }
}
