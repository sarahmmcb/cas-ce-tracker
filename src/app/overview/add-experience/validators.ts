import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// export const positiveValueValidator: ValidatorFn = () =>
//   (control: AbstractControl): ValidationErrors | null => {
//     const value = control.value;

//     return value <= 0 ? { nonPositiveValue: true} : null;
//   };

export function positiveValueValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    return value <= 0 ? { nonPositiveValue: true} : null;
  };
};
