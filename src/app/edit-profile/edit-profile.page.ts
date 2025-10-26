import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { AlertService } from '../services/alert.service';
import { User, NationalStandard } from '../models/user';
import { UserService } from '../services/user.service';
import { NgIf, NgClass, NgFor, CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { EditProfilePageRoutingModule } from './edit-profile-routing.module';
import { AlertButtonRole, AlertType } from '../models/alert';

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.page.html',
    styleUrls: ['./edit-profile.page.scss'],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        IonicModule,
        EditProfilePageRoutingModule,
        NgIf, NgFor, NgClass
    ]
})
export class EditProfilePage implements OnInit, OnDestroy {
  /**
   * User object.
   */
  public user: User;

  /**
   * Profile form group.
   */
  public profileForm: UntypedFormGroup;

  /**
   * Possible National Standards.
   */
  public nationalStandards: NationalStandard[] = [];

  /**
   * Flag indicating whether form has been submitted.
   */
  public submitted = false;

  /**
   * User object subscription.
   */
  private userSub: Subscription;

  constructor(
    private authService: AuthService,
    private fb: UntypedFormBuilder,
    private userService: UserService,
    private router: Router,
    private alertService: AlertService
  ) {}

  /**
   * On Init.
   */
  public ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(
      (user) => (this.user = user)
    );
    this.initializeData();
    this.initializeFormControls();
  }

  /**
   * On Destroy.
   */
  public ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  /**
   * On Submit.
   */
  public onSubmit(): void {
    console.log(this.profileForm);
    this.submitted = true;
    if (!this.profileForm.valid) {
      return;
    }
  }

  /**
   * Logic executed when cancel button is pressed.
   */
  public onCancel(): Promise<boolean> | void {
    if (this.profileForm.dirty) {
      this.alertService.showAlert({
        title: 'Confirm',
        content: 'Are you you want to quit? Your changes will not be saved.',
        type: AlertType.confirm,
        buttons: [
          {
            text: 'OK',
            role: AlertButtonRole.confirm,
            id: 'confirmButton',
            action: () => this.router.navigateByUrl('/overview'),
          },
          {
            text: 'Cancel',
            role: AlertButtonRole.cancel,
            id: 'cancelButton',
            action: () => {},
          },
        ],
      });
    } else {
      this.router.navigateByUrl('/overview');
    }
  }

  /**
   * Fetch data for form dropdowns.
   */
  private initializeData(): void {
    this.nationalStandards = this.userService.fetchNationalStandards();
  }

  /**
   * Set up form controls.
   */
  private initializeFormControls(): void {
    this.profileForm = this.fb.group({
      firstName: [this.user.firstName, Validators.required],
      lastName: [this.user.lastName, Validators.required],
      email: [this.user.email, Validators.required],
      title: this.user.title,
      nationalStandard: [
        this.user.nationalStandard.nationalStandardId,
        Validators.required,
      ],
    });
  }
}
