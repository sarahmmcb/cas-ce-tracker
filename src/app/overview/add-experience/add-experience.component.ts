import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputCustomEvent, LoadingController, ModalController } from '@ionic/angular';
import { DateTime } from 'luxon';
import * as math from 'mathjs';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CEAlertService } from 'src/app/core/alert.service';
import { ICECategory, ICECategoryList } from 'src/app/models/category';
import { ICEExperience, ICEExperienceAmount, ICEUnit, IUpdateExperience } from 'src/app/models/experience';
import { ICELocation } from 'src/app/models/location';
import { CEExperienceService } from 'src/app/services/experience.service';

import { positiveValueValidator } from './validators';

@Component({
  selector: 'app-add-experience',
  templateUrl: './add-experience.component.html',
  styleUrls: ['./add-experience.component.scss'],
})
export class AddExperienceComponent implements OnInit {

  /**
   * Experience data input if the experience
   * is being edited.
   */
  @Input()
  public ceExperience: ICEExperience;
  public formTitle: string;
  public categoryLists: ICECategoryList[] = [];
  public locations: ICELocation[] = [];
  public ceUnits: ICEUnit[] = [];
  public parentUnit: ICEUnit;
  public childUnit: ICEUnit;
  public addForm: FormGroup;
  public submitted = false;
  public parentAmount: ICEExperienceAmount;
  // Time spent in the standard's accepted unit, as calculated from the parent unit.
  public childAmount: ICEExperienceAmount;
  public carryForwardYear: number;
  public isLoading = false;
  public fetchError: string;

  private loading: HTMLIonLoadingElement;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private experienceService: CEExperienceService,
    private alertService: CEAlertService,
    private loadingCtrl: LoadingController
  ) {}


  // Helper method to access category form group in the template.
  public get categories(): FormArray {
    return this.addForm.get('categories') as FormArray;
  }

  public ngOnInit(): void {
    this.fetchData();
  }

  public onCancel(): Promise<boolean> | void {
    // present confirmation modal
    if (this.addForm && this.addForm.dirty) {
      // define alert here and add modalCtrl.dismiss() to button handler
      this.alertService.showAlert({
        title: 'Confirm',
        content: 'Are you you want to quit? Your changes will not be saved.',
        type: 'confirm',
        buttons: [{
          text: 'OK',
          role: 'confirm',
          id: 'confirmButton',
          action: () => this.modalCtrl.dismiss()
        }, {
          text: 'Cancel',
          role: 'cancel',
          id: 'cancelButton',
          action: () => {}
        }]
      });
    } else {
      this.modalCtrl.dismiss();
    }
  }

  public onSubmit(): void {
    console.log(this.addForm.getRawValue());
    this.submitted = true;
    if (!this.addForm.valid) {
      return;
    }

    // send to server and return with updated experience object.
    if (this.ceExperience.ceExperienceId === 0) {
      this.experienceService.addExperience(this.prepareExperienceData()).subscribe();
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
      ceExperienceId: this.ceExperience.ceExperienceId,
      categories: [...this.addForm.value.categories],
    };
  }

  private async fetchData() {
    this.isLoading = true;
    this.loading = await this.loadingCtrl.create({
      message: 'Loading form data'
    });
    await this.loading.present();
    const dataCalls = forkJoin({
      getCategoryLists: this.experienceService.fetchCategoryLists(),
      getLocations: this.experienceService.fetchLocations(),
      getUnitInfo: this.experienceService.fetchUnitInfo()
    }).pipe(
      catchError(error => of(error))
    );

    dataCalls.subscribe(async res => {
      if (res.errorMessage) {
        this.formTitle = 'Experience Form';
        this.fetchError = 'There was a problem fetching the form data. Please try again later.';
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

    this.formTitle = this.ceExperience.ceExperienceId !== 0 ? 'Update CE' : 'Add CE';
    this.isLoading = false;
  }

  private initializeUnits() {
    this.parentUnit = this.ceUnits.find((u) => u.parentUnitId === 0);
    this.childUnit = this.ceUnits.find((u) => u.parentUnitId !== 0);
  }

  private initializeExperienceData(): void {
    if (!this.ceExperience) {
      this.ceExperience = new ICEExperience();
    }

    this.carryForwardYear = DateTime.fromSQL(this.ceExperience.startDate).plus({
      years: 1,
    }).year || (new Date().getFullYear() + 1);

    this.parentAmount = this.ceExperience.amounts.find(
      (p) => p.ceUnitId === this.parentUnit.ceUnitId
    ) || new ICEExperienceAmount();

    this.childAmount = this.ceExperience.amounts.find(
      (p) => p.ceUnitId === this.childUnit.ceUnitId
    ) || new ICEExperienceAmount();
  }

  private initializeFormControls(): void {
    this.addForm = this.fb.group({
      ceDate: [this.ceExperience.startDate, Validators.required],
      ceLocationId: this.ceExperience.location.ceLocationId,
      programTitle: [this.ceExperience.programTitle, Validators.required],
      eventName: this.ceExperience.eventName,
      description: this.ceExperience.description,
      timeSpentParent: [this.parentAmount.amount, [Validators.required, positiveValueValidator()]],
      timeSpentChild: new FormControl({
        value: this.childAmount.amount,
        disabled: this.childUnit?.isDisabled,
      }),
      carryForward: this.ceExperience.carryForward,
      notes: this.ceExperience.notes,
      categories: this.fb.array([]),
    });

    // Add categorylist controls
     for(const catList of this.categoryLists) {
      const chosenCategory: ICECategory = this.ceExperience.categories.find(
        (c) => c.categoryListId === catList.ceCategoryListId
      );

      if (chosenCategory) {
        // if we are updating, prepopulate with existing data.
        this.categories.push(new FormControl(chosenCategory.ceCategoryId, [Validators.required]));
      } else {
        this.categories.push(new FormControl(null, [Validators.required]));
      }
    }
  }
}
