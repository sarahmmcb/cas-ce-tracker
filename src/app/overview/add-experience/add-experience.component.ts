import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { InputCustomEvent, ModalController } from '@ionic/angular';
import { DateTime } from 'luxon';
import * as math from 'mathjs';
import { CEAlertService } from 'src/app/core/alert.service';
import { CECategory, CECategoryList } from 'src/app/models/category';
import { CEExperience, CEExperienceAmount, CEUnit } from 'src/app/models/experience';
import { CELocation } from 'src/app/models/location';
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
  public ceExperience: CEExperience;

  /**
   * Title of form based on add or update.
   */
  public formTitle: string;

  /**
   * Category lists.
   */
  public categoryLists: CECategoryList[] = [];

  /**
   * Possible CE locations.
   */
  public locations: CELocation[] = [];

  /**
   * Possible CE units.
   */
  public ceUnits: CEUnit[] = [];

  /**
   * Parent unit.
   */
  public parentUnit: CEUnit;

  /**
   * Child Unit.
   */
  public childUnit: CEUnit;

  /**
   * Form group property.
   */
  public addForm: FormGroup;

  /**
   * Flag indicated whether or not form has been submitted.
   */
  public submitted = false;

  /**
   * Time spent in the unit entered by user.
   */
  public parentAmount: CEExperienceAmount;

  /**
   * Time spent in the standard's accepted unit, as
   * calculated from the parent unit.
   */
  public childAmount: CEExperienceAmount;

  /**
   * Year to carry CE forward to.
   */
  public carryForwardYear: number;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private experienceService: CEExperienceService,
    private alertService: CEAlertService,
  ) {}

  /**
   * Helper method to access category form group.
   */
  public get categories(): FormArray {
    return this.addForm.get('categories') as FormArray;
  }

  /**
   * On Init.
   */
  public ngOnInit(): void {
    this.initializeData();
    this.initializeExperienceData();
    this.initializeFormControls();

    this.formTitle = this.ceExperience.ceExperienceId !== 0 ? 'Update CE' : 'Add CE';
  }

  /**
   * Logic executed when cancel button is pressed.
   */
  public onCancel(): Promise<boolean> | void {
    // present confirmation modal
    if (this.addForm.dirty) {
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

  /**
   * Logic to submit form.
   */
  public onSubmit(): void {
    console.log(this.addForm.getRawValue());
    this.submitted = true;
    if (!this.addForm.valid) {
      return;
    }

    // Update/add experience object with form data
    // or... send to server and return with updated experience object.
    if (this.ceExperience.ceExperienceId === 0) {
      this.experienceService.addExperience(this.addForm.value);
    } else {
      this.experienceService.addExperience(
        this.addForm.value,
        this.ceExperience
      );
    }

    this.modalCtrl.dismiss();
  }

  public selectChange(event: any) {
    console.log(event);
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

  private initializeData(): void {
    // fetch categories by list
    this.categoryLists = this.experienceService.fetchCategoryLists();
    // fetch possible locations
    this.locations = this.experienceService.fetchLocations();
    // fetch possible units
    this.experienceService.fetchUnitInfo().subscribe(res => this.ceUnits = res);
    this.parentUnit = this.ceUnits.find((u) => u.parentUnitId === 0);
    this.childUnit = this.ceUnits.find((u) => u.parentUnitId !== 0);
  }

  /**
   * Initialize experience data.
   */
  private initializeExperienceData(): void {
    if (!this.ceExperience) {
      this.ceExperience = new CEExperience();
    }

    this.carryForwardYear = DateTime.fromSQL(this.ceExperience.startDate).plus({
      years: 1,
    }).year || (new Date().getFullYear() + 1);

    this.parentAmount = this.ceExperience.amounts.find(
      (p) => p.ceUnitId === this.parentUnit.ceUnitId
    ) || new CEExperienceAmount();

    this.childAmount = this.ceExperience.amounts.find(
      (p) => p.ceUnitId === this.childUnit.ceUnitId
    ) || new CEExperienceAmount();
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
        disabled: this.childUnit.isDisabled,
      }),
      carryForward: this.ceExperience.carryForward,
      notes: this.ceExperience.notes,
      categories: this.fb.array([]),
    });

    // Add categorylist controls
     for(const catList of this.categoryLists) {
      const chosenCategory: CECategory = this.ceExperience.categories.find(
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
