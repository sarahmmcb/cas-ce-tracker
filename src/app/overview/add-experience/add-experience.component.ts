import { Component, computed, input, Input, OnDestroy, OnInit, Signal, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputCustomEvent, ModalController, IonicModule } from '@ionic/angular';
import * as math from 'mathjs';
import { catchError, forkJoin, Subscription, throwError } from 'rxjs';
import { AuthService } from '@app/auth/auth.service';
import { AlertService } from '@app/services/alert.service';
import { ICategoryList } from '@app/models/category';
import {
  Experience,
  ExperienceAmount,
  IExperienceCategory,
  IUnit,
  IUpdateExperience,
} from '@app/models/experience';
import { Location } from '@app/models/location';
import { User } from '@app/models/user';
import { ExperienceService } from '@app/services/experience.service';

import { positiveValueValidator } from './validators';
import { UserService } from '@app/services/user.service';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ErrorComponent } from '@app/core/error/error.component';
import { AlertButtonRole, AlertType } from '@app/models/alert';
import { StaticDataService } from '@app/services/static-data.service';
import { LoadingService } from '@app/services/loading.service';

@Component({
    selector: 'app-add-experience',
    templateUrl: './add-experience.component.html',
    styleUrls: ['./add-experience.component.scss'],
    standalone: true,
    imports: [IonicModule, FormsModule, ReactiveFormsModule, NgClass, NgTemplateOutlet, ErrorComponent]
})
export class AddExperienceComponent implements OnInit, OnDestroy {

  public experienceInput = input<Experience>();
  public experience: Signal<Experience>;
  public formTitle = signal<string>(undefined);
  public categoryLists = signal<ICategoryList[]>([]);
  public locations = signal<Location[]>([]);
  public ceUnits = signal<IUnit[]>([]);
  public parentUnit = signal<IUnit>(null);
  public childUnit = signal<IUnit>(null);
  public addForm = signal<FormGroup>(null);
  public submitted = signal(false);
  public parentAmount = signal<ExperienceAmount>({} as ExperienceAmount);
  // Time spent in the standard's accepted unit, as calculated from the parent unit.
  public childAmount = signal<ExperienceAmount>(null);
  public carryForwardYear = signal<number>(undefined);
  public fetchError = signal<string>(undefined);
  public user = signal<User>(null);
  public isLoading: Signal<boolean>;

  private userSub: Subscription;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private experienceService: ExperienceService,
    private alertService: AlertService,
    private authService: AuthService,
    private userService: UserService,
    private staticDataService: StaticDataService,
    private loadingService: LoadingService
  ) {}

  // Helper method to access category form group in the template.
  public get categories(): FormArray {
    return this.addForm().get('categories') as FormArray;
  }

  public ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      this.user.set(user);
      this.isLoading = this.loadingService.isLoading;
      this.fetchData();
    });
  }

  public ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  public onCancel(): Promise<boolean> | void {
    if (this.addForm && this.addForm().dirty) {
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
    this.submitted.set(true);
    if (!this.addForm().valid) {
      return;
    }

    this.loadingService.showLoadingControl();
    if (this.experience().experienceId === 0) {
      this.experienceService
        .createExperience(this.prepareExperienceData())
        .subscribe({
          next: () => {
            this.loadingService.dismissLoadingControl();
            this.onUpdateSuccess('added');
          },
          error: err => this.onUpdateFailure()
        });
    } else {
      this.experienceService
        .updateExperience(this.prepareExperienceData())
        .subscribe({
          next: () => {
            this.loadingService.dismissLoadingControl();
            this.onUpdateSuccess('updated');
           },
          error: err => {
            this.loadingService.dismissLoadingControl();
            this.onUpdateFailure();
          }
        });
    }
  }

  public onAmountEdit(event: InputCustomEvent): void {
    if (!event.target.value) {
      return;
    }

    const newValue = math.evaluate(
        event.target.value.toString() + this.childUnit().conversionFormula);

    this.addForm().controls['timeSpentChild'].setValue( newValue );
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
          id: 'alert-confirm',
          action: () => this.modalCtrl.dismiss()
        }],
        type: AlertType.error,
    });
  }

  private prepareExperienceData(): IUpdateExperience {
    return {
      ...this.addForm().value,
      experienceId: this.experience().experienceId,
      userId: this.user().id,
      categories: [...this.addForm().value.categories],
      timeSpentChild: {
        experienceId: this.experience().experienceId,
        unitId: this.childUnit().unitId,
        amount: this.addForm().value.timeSpentChild
      },
      timeSpentParent: {
        experienceId: this.experience().experienceId,
        unitId: this.parentUnit().unitId,
        amount: this.addForm().value.timeSpentParent
      }
    };
  }

  private async fetchData() {
    this.loadingService.showLoadingControl();

    const dataCalls = forkJoin({
      getCategoryLists: this.staticDataService.getCategoryLists(
        this.user().nationalStandard.nationalStandardId,
        this.userService.selectedYear
      ),
      getLocations: this.staticDataService.getLocations(),
      getUnitInfo: this.staticDataService.getUnits(
        this.user().nationalStandard.nationalStandardId
      )
    }).pipe(
      catchError((err) => {
        return throwError(() => err)})
    );

    dataCalls.subscribe({
      next: (res) => {
        if (!res.getCategoryLists ||
            res.getCategoryLists.length === 0 || 
            !res.getLocations ||
            res.getLocations.length === 0 ||
            !res.getUnitInfo ||
            res.getUnitInfo.length === 0) {
          this.handleFormDataLoadError();
        } else {
          this.categoryLists.set(res.getCategoryLists);
          this.locations.set(res.getLocations);
          this.ceUnits.set(res.getUnitInfo);
  
          this.initializeData();
          this.loadingService.dismissLoadingControl();
        }
      },
      error: (err) => this.handleFormDataLoadError()
    });
  }

  private handleFormDataLoadError() {
    this.fetchError.set('There was an error fetching the form data. Please try again later.');
    this.loadingService.dismissLoadingControl();
  }

  private initializeData(): void {
    this.initializeUnits();
    this.initializeExperienceData();
    this.initializeFormControls();

    this.formTitle.set(
      this.experience().experienceId !== 0 ? 'Update CE' : 'Add CE');
  }

  private initializeUnits() {
    this.parentUnit.set(this.ceUnits().find((u) => u.parentUnitId === 0));
    this.childUnit.set(this.ceUnits().find((u) => u.parentUnitId !== 0));
  }

  private initializeExperienceData(): void {
    this.experience = computed(() => this.experienceInput() || new Experience());

    this.carryForwardYear.set(
      new Date(this.experience().startDate).getFullYear() + 1 ||
      new Date().getFullYear() + 1);

    this.parentAmount.set(
      this.experience().amounts.find(
        (p) => p.unitId === this.parentUnit().unitId
      ) || new ExperienceAmount());

    this.childAmount.set(
      this.experience().amounts.find(
        (p) => p.unitId === this.childUnit().unitId
      ) || new ExperienceAmount());
  }

  private initializeFormControls(): void {
    const now = new Date();
    const defaultDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0, 0));
    
    this.addForm.set(this.fb.group({
      startDate: [this.experience().startDate || defaultDate.toISOString(), Validators.required],
      locationId: this.experience().location.locationId,
      programTitle: [this.experience().programTitle, Validators.required],
      eventName: this.experience().eventName,
      description: this.experience().description,
      timeSpentParent: [
        this.parentAmount().amount,
        [Validators.required, positiveValueValidator()],
      ],
      timeSpentChild: new FormControl({
        value: this.childAmount().amount,
        disabled: false,
      }),
      carryForward: this.experience().carryForward,
      notes: this.experience().notes,
      categories: this.fb.array([]),
    }));

    for (const catList of this.categoryLists()) {
      const chosenCategory: IExperienceCategory = this.experience().categories.find(
        (c) => c.categoryListId === catList.categoryListId
      );

      if (this.experience().experienceId && chosenCategory) {
        this.categories.push(
          new FormControl(chosenCategory.categoryId, [Validators.required])
        );
      }
      else if (this.experience().experienceId) {
        this.categories.push(new FormControl(0, [Validators.required]));
      } 
      else {
        this.categories.push(new FormControl(null, [Validators.required]));
      }
    }
  }
}
