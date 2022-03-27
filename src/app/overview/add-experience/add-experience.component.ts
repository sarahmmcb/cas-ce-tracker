import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CEExperience } from 'src/app/models/experience';
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
   * Form group property.
   */
  public addForm: FormGroup;

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

    this.addForm = this.fb.group({
      ceDate: this.ceExperience.startDate,
      programTitle: this.ceExperience.programTitle,
      eventName: this.ceExperience.eventName,
      description: this.ceExperience.description
    });
  }

  /**
   * Close the modal.
   */
  public async onClose(): Promise<boolean> {
    return await this.modalCtrl.dismiss();
  }

  public onSubmit(addForm: FormGroup): void {

  }

}
