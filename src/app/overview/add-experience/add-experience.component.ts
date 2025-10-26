import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputCustomEvent, LoadingController, ModalController, IonicModule } from '@ionic/angular';
import * as math from 'mathjs';
import { catchError, forkJoin, Subscription, throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { ICategoryList } from 'src/app/models/category';
import {
  Experience,
  ExperienceAmount,
  IExperienceCategory,
  IUnit,
  IUpdateExperience,
} from 'src/app/models/experience';
import { Location } from 'src/app/models/location';
import { User } from 'src/app/models/user';
import { ExperienceService } from 'src/app/services/experience.service';

import { positiveValueValidator } from './validators';
import { UserService } from 'src/app/services/user.service';
import { NgIf, NgClass, NgFor, NgTemplateOutlet } from '@angular/common';
import { ErrorComponent } from 'src/app/core/error/error.component';
import { AlertButtonRole, AlertType } from 'src/app/models/alert';
import { StaticDataService } from 'src/app/services/static-data.service';

@Component({
    selector: 'app-add-experience',
    templateUrl: './add-experience.component.html',
    styleUrls: ['./add-experience.component.scss'],
    standalone: true,
    imports: [IonicModule, NgIf, FormsModule, ReactiveFormsModule, NgClass, NgFor, NgTemplateOutlet, ErrorComponent]
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
  public user: User;

  private loading: HTMLIonLoadingElement;
  private userSub: Subscription;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private experienceService: ExperienceService,
    private alertService: AlertService,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private userService: UserService,
    private staticDataService: StaticDataService
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
    if (this.addForm && this.addForm.dirty) {
      this.alertService.showAlert({
        title: 'Confirm',
        content: 'Are you you want to quit? Your changes will not be saved.',
        type: AlertType.confirm,
        buttons: [
          {
            text: 'OK',
            role: AlertButtonRole.confirm,
            id: 'confirmButton',
            action: () => this.modalCtrl.dismiss(),
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
      this.modalCtrl.dismiss();
    }
  }

  public onSubmit(): void {
    this.submitted = true;
    if (!this.addForm.valid) {
      return;
    }

    if (this.experience.experienceId === 0) {
      this.experienceService
        .createExperience(this.prepareExperienceData())
        .subscribe({
          next: () => this.onUpdateSuccess('added'),
          error: err => this.onUpdateFailure()
        });
    } else {
      this.experienceService
        .updateExperience(this.prepareExperienceData())
        .subscribe({
          next: () => this.onUpdateSuccess('updated'),
          error: err => this.onUpdateFailure()
        });
    }
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

  private onUpdateSuccess(action: string): void {
    this.alertService.showAlert({
        title: 'Success',
        content: `Experience ${action} successfully`,
        buttons: [{
          text: 'Ok',
          role: AlertButtonRole.confirm,
          id: 'alert-confirm',
          action: () => this.modalCtrl.dismiss()
        }],
        type: AlertType.info,
        routeOnClose: '/overview'
    });
  }

  private onUpdateFailure(): void {
        this.alertService.showAlert({
        title: 'Error',
        content: `An error occurred, please try again later`,
        buttons: [{
          text: 'Ok',
          role: AlertButtonRole.confirm,
          id: 'alert-confirm'
        }],
        type: AlertType.error,
    });
  }

  private prepareExperienceData(): IUpdateExperience {
    return {
      ...this.addForm.value,
      experienceId: this.experience.experienceId,
      userId: this.user.id,
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

    const dataCalls = forkJoin({
      getCategoryLists: this.staticDataService.getCategoryLists(
        this.user.nationalStandard.nationalStandardId,
        this.userService.selectedYear
      ),
      getLocations: this.staticDataService.getLocations(),
      getUnitInfo: this.staticDataService.getUnits(
        this.user.nationalStandard.nationalStandardId
      )
    }).pipe(
      catchError((err) => {
        return throwError(() => err)})
    );

    dataCalls.subscribe({
      next: async (res) => {
        if (res.getCategoryLists.length === 0 || 
            res.getLocations.length === 0 ||
            res.getUnitInfo.length === 0
        ) {
          this.handleFormDataLoadError();
        } else {
          this.categoryLists = res.getCategoryLists;
          this.locations = res.getLocations;
          this.ceUnits = res.getUnitInfo;
  
          this.initializeData();
        }

        await this.dismissLoading();
      },
      error: async (err) => await this.handleFormDataLoadError()
    });
  }

  private async handleFormDataLoadError(): Promise<boolean> {
    this.fetchError = 'There was an error fetching the form data. Please try again later.'
    return await this.dismissLoading();
  }

  private async dismissLoading(): Promise<boolean> {
    this.isLoading = false;
    return await this.loading.dismiss();
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
      new Date(this.experience.startDate).getFullYear() + 1 ||
      new Date().getFullYear() + 1;

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
    const now = new Date();
    const defaultDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0, 0));
    
    this.addForm = this.fb.group({
      startDate: [this.experience.startDate || defaultDate.toISOString(), Validators.required],
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
        disabled: this.childUnit?.isDisabled,
      }),
      carryForward: this.experience.carryForward,
      notes: this.experience.notes,
      categories: this.fb.array([]),
    });

    for (const catList of this.categoryLists) {
      const chosenCategory: IExperienceCategory = this.experience.categories.find(
        (c) => c.categoryListId === catList.categoryListId
      );

      if (this.experience.experienceId && chosenCategory) {
        this.categories.push(
          new FormControl(chosenCategory.categoryId, [Validators.required])
        );
      }
      else if (this.experience.experienceId) {
        this.categories.push(new FormControl(0, [Validators.required]));
      } 
      else {
        this.categories.push(new FormControl(null, [Validators.required]));
      }
    }
  }
}
