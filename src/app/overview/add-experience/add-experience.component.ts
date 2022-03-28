import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { InputCustomEvent, ModalController } from '@ionic/angular';
import { CEExperience, CEExperienceAmount } from 'src/app/models/experience';
import { ExperienceService } from 'src/app/services/experience.service';
import * as math from 'mathjs';
import { CategoryList } from 'src/app/models/category';

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
  public categoryLists: CategoryList[] = [];

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

  constructor(private modalCtrl: ModalController,
              private fb: FormBuilder,
              private experienceService: ExperienceService) { }

  /**
   * On Init.
   */
  ngOnInit() {
    if(!this.ceExperience) {
      this.ceExperience = new CEExperience();

      // fetch unit info
      // need a user service to get user info
      // to supply nationalstandard id.
     this.ceExperience.amounts = this.experienceService.fetchUnitInfo();
    }

    this.parentAmount = this.ceExperience.amounts.find(p => p.parentUnitId === 0);
    this.childAmount = this.ceExperience.amounts.find(p => p.parentUnitId !== 0);

    // fetch categories by list
    this.categoryLists = this.experienceService.fetchCategoryLists();

    this.addForm = this.fb.group({
      ceDate: this.ceExperience.startDate,
      programTitle: this.ceExperience.programTitle,
      eventName: this.ceExperience.eventName,
      description: this.ceExperience.description,
      timeSpentParent: this.parentAmount.amount,
      timeSpentChild: new FormControl({
        value: this.childAmount.amount,
        disabled: this.childAmount.isDisabled
      }),
    });
  }

  /**
   * Close the modal.
   */
  public async onClose(): Promise<boolean> {
    return await this.modalCtrl.dismiss();
  }

  /**
   * Logic to submit form.
   */
  public onSubmit(): void {

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
