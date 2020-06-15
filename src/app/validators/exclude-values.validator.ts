import { AbstractControl, ValidatorFn, FormGroup } from '@angular/forms';

export function excludeValuesValidator(values: string[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const value = control.value;
    if (value === '') {
      return null;
    }
    return values.includes(value) ? { isExisted: { value } } : null;
  };
}
