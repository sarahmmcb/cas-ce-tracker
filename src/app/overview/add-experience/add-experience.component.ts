import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  InputCustomEvent,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { DateTime } from 'luxon';
import * as math from 'mathjs';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { CEAlertButton } from 'src/app/core/alert';
import { CEAlertService } from 'src/app/core/alert.service';
import { ICategory, ICategoryList } from 'src/app/models/category';
import {
  IExperience,
  IExperienceAmount,
  IUnit,
  IUpdateExperience,
} from 'src/app/models/experience';
import { ILocation } from 'src/app/models/location';
import { CEUser } from 'src/app/models/user';
import { ExperienceService } from 'src/app/services/experience.service';

import { positiveValueValidator } from './validators';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-experience',
  templateUrl: './add-experience.component.html',
  styleUrls: ['./add-experience.component.scss'],
})
export class AddExperienceComponent implements OnInit, OnDestroy {
  /**
   * Experience data input if the experience
   * is being edited.
   */
  @Input()
  public ceExperience: IExperience;
  public formTitle: string;
  public categoryLists: ICategoryList[] = [];
  public locations: ILocation[] = [];
  public ceUnits: IUnit[] = [];
  public parentUnit: IUnit;
  public childUnit: IUnit;
  public addForm: FormGroup;
  public submitted = false;
  public parentAmount: IExperienceAmount;
  // Time spent in the standard's accepted unit, as calculated from the parent unit.
  public childAmount: IExperienceAmount;
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
    return this.addForm.get('categories') as FormArray;
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
    if (this.ceExperience.ceExperienceId === 0) {
      this.experienceService
        .addExperience(this.prepareExperienceData())
        .subscribe();
    } else {
      // this.experienceService.updateExperience(
      //   this.prepareExperienceData()
      // );
    }

    this.modalCtrl.dismiss();
  }

  /**
   * Update child amount when parent amount
   * id edited.
   *
   * @param event ion blur event
   */
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

  private prepareExperienceData(): IUpdateExperience {
    return {
      ...this.addForm.value,
      experienceId: this.ceExperience.ceExperienceId,
      categories: [...this.addForm.value.categories],
    };
  }

  private async fetchData() {
    this.isLoading = true;
    this.loading = await this.loadingCtrl.create({
      message: 'Loading form data',
    });
    await this.loading.present();
    const dataCalls = forkJoin({
      getCategoryLists: this.experienceService.fetchCategoryLists(
        this.user.nationalStandard.nationalStandardId,
        this.userService.year
      ),
      getLocations: this.experienceService.fetchLocations(),
      getUnitInfo: this.experienceService.fetchUnitInfo(
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
      this.ceExperience.ceExperienceId !== 0 ? 'Update CE' : 'Add CE';
    this.isLoading = false;
  }

  private initializeUnits() {
    this.parentUnit = this.ceUnits.find((u) => u.parentUnitId === 0);
    this.childUnit = this.ceUnits.find((u) => u.parentUnitId !== 0);
  }

  private initializeExperienceData(): void {
    if (!this.ceExperience) {
      this.ceExperience = new IExperience();
    }

    this.carryForwardYear =
      DateTime.fromSQL(this.ceExperience.startDate).plus({
        years: 1,
      }).year || new Date().getFullYear() + 1;

    this.parentAmount =
      this.ceExperience.amounts.find(
        (p) => p.unitId === this.parentUnit.unitId
      ) || new IExperienceAmount();

    this.childAmount =
      this.ceExperience.amounts.find(
        (p) => p.unitId === this.childUnit.unitId
      ) || new IExperienceAmount();
  }

  private initializeFormControls(): void {
    this.addForm = this.fb.group({
      ceDate: [this.ceExperience.startDate, Validators.required],
      ceLocationId: this.ceExperience.location.locationId,
      programTitle: [this.ceExperience.programTitle, Validators.required],
      eventName: this.ceExperience.eventName,
      description: this.ceExperience.description,
      timeSpentParent: [
        this.parentAmount.amount,
        [Validators.required, positiveValueValidator()],
      ],
      timeSpentChild: new FormControl({
        value: this.childAmount.amount,
        disabled: this.childUnit?.isDisabled,
      }),
      carryForward: this.ceExperience.carryForward,
      notes: this.ceExperience.notes,
      categories: this.fb.array([]),
    });

    // Add categorylist controls
    for (const catList of this.categoryLists) {
      const chosenCategory: ICategory = this.ceExperience.categories.find(
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
