import { Component, Input, OnInit } from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { InputCustomEvent, ModalController } from '@ionic/angular';
import { DateTime } from 'luxon';
import * as math from 'mathjs';
import { CECategory, CECategoryList } from 'src/app/models/category';
import { CEExperience, CEExperienceAmount, CEUnit } from 'src/app/models/experience';
import { CELocation } from 'src/app/models/location';
import { ExperienceService } from 'src/app/services/experience.service';

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
    private experienceService: ExperienceService
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
   * Close the modal.
   */
  public async onClose(): Promise<boolean> {
    if (this.addForm.dirty) {
      // check if user really wants to close
    }

    return await this.modalCtrl.dismiss();
  }

  public onCancel(): void {
    // show confirmation
    this.onClose();
  }

  /**
   * Logic to submit form.
   */
  public onSubmit(): void {
    console.log(this.addForm.getRawValue());

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

    this.onClose();
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

  /**
   * Fetch needed data and initialize needed variables.
   */
  private initializeData(): void {
    // TODO: make a DTO object to get all this form info in one call.
    // Most of this should be loaded on app startup
    // fetch categories by list
    this.categoryLists = this.experienceService.fetchCategoryLists();
    // fetch possible locations
    this.locations = this.experienceService.fetchLocations();
    // fetch possible units
    this.ceUnits = this.experienceService.fetchUnitInfo();
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

  /**
   * Initialize form controls.
   */
  private initializeFormControls(): void {
    this.addForm = this.fb.group({
      ceDate: this.ceExperience.startDate,
      ceLocationId: this.ceExperience.location.ceLocationId,
      programTitle: this.ceExperience.programTitle,
      eventName: this.ceExperience.eventName,
      description: this.ceExperience.description,
      timeSpentParent: this.parentAmount.amount,
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

      if (catList.categories.length === 1) {
        // set the value of the radio button group
        if (chosenCategory) {
          // if we are updating, prepopulate with existing data.
          this.categories.push(new FormControl(chosenCategory.ceCategoryId));
        } else {
          this.categories.push(new FormControl());
        }
      } else {
        // set the value of the select list
        if (chosenCategory) {
          this.categories.push(new FormControl(chosenCategory.ceCategoryId));
        } else {
          this.categories.push(new FormControl());
        }
      }
    }
  }
}
