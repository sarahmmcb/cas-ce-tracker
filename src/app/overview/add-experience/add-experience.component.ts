import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { InputCustomEvent, ModalController } from '@ionic/angular';
import * as math from 'mathjs';
import { CECategory, CECategoryList } from 'src/app/models/category';
import { CEExperience, CEExperienceAmount } from 'src/app/models/experience';
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
   * Category lists.
   */
  public categoryLists: CECategoryList[] = [];

  /**
   * Possible CE locations.
   */
  public locations: CELocation[] = [];

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
   * Base name for dynamically created
   * category list form control.
   */
  public catListFormControlName = 'catlist';

  constructor(private modalCtrl: ModalController,
              private fb: FormBuilder,
              private experienceService: ExperienceService) { }

  /**
   * On Init.
   */
  ngOnInit() {
    // TODO: make a DTO object to get all this form info in one call.
    // fetch categories by list
    this.categoryLists = this.experienceService.fetchCategoryLists();
    // fetch possible locations
    this.locations = this.experienceService.fetchLocations();

    if(!this.ceExperience) {
      this.ceExperience = new CEExperience();

      // fetch unit info
      // need a user service to get user info
      // to supply nationalstandard id.
     this.ceExperience.amounts = this.experienceService.fetchAmountInfo();
    }

    this.parentAmount = this.ceExperience.amounts.find(p => p.parentUnitId === 0);
    this.childAmount = this.ceExperience.amounts.find(p => p.parentUnitId !== 0);

    this.addForm = this.fb.group({
      ceDate: this.ceExperience.startDate,
      ceLocation: this.ceExperience.location.ceLocationId || 0,
      programTitle: this.ceExperience.programTitle,
      eventName: this.ceExperience.eventName,
      description: this.ceExperience.description,
      timeSpentParent: this.parentAmount.amount,
      timeSpentChild: new FormControl({
        value: this.childAmount.amount,
        disabled: this.childAmount.isDisabled
      }),
      notes: this.ceExperience.notes
    });

    // Add categorylist controls
    for(let i = 0; i < this.categoryLists.length; i++){
      const chosenCategory: CECategory =
            this.ceExperience.categories.find(c => c.categoryListId === this.categoryLists[i].ceCategoryListId);

      if(this.categoryLists[i].categories.length === 1) {
        // set the value of the radio button group
        if(chosenCategory) {
          this.addForm.addControl(this.catListFormControlName + i, new FormControl(chosenCategory.ceCategoryId));
        }
        else{
          this.addForm.addControl(this.catListFormControlName + i, new FormControl());
        }

      }
      else {
        // set the value of the select list
        if (chosenCategory) {
          this.addForm.addControl(this.catListFormControlName + i, new FormControl(chosenCategory.ceCategoryId));
        }
        else {
          this.addForm.addControl(this.catListFormControlName + i, new FormControl());
        }
      }
    }
  }

  /**
   * Close the modal.
   */
  public async onClose(): Promise<boolean> {
    if(this.addForm.dirty) {
      // check if user really wants to close
    }

    return await this.modalCtrl.dismiss();
  }

  /**
   * Logic to submit form.
   */
  public onSubmit(): void {
    console.log(this.addForm.value);

    // Update experience object with form data

  }

  public selectChange(event: any){
    console.log(event);
  }

  /**
   * Update child amount when parent amount
   * id edited.
   *
   * @param event ion blur event
   */
  public onAmountEdit(event: InputCustomEvent): void {
    if(!event.target.value){
      return;
    }

    this.addForm.patchValue({
      timeSpentChild: math.evaluate(event.target.value.toString() + this.childAmount.conversionFormula)
    });
  }

}
