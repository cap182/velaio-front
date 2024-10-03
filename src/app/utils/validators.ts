import { AbstractControl, FormArray, FormControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  
  static atLeastOneValidator(control: AbstractControl): ValidationErrors | null {
    const formArray = control as FormArray;
    return formArray.length > 0 ? null : { atLeastOne: true };
  }
 
  static noDuplicateUsers(control: AbstractControl): ValidationErrors | null {
    const formArray = control as FormArray;
    const userNames = formArray.controls.map((userGroup: AbstractControl) => userGroup.get('userName')?.value.replaceAll(' ','').toLowerCase());
    const duplicates = userNames.filter((name, index, array) => array.indexOf(name) !== index);

    return duplicates.length > 0 ? { duplicateUsers: true } : null;
  }

  static minDateValidator(control: FormControl): ValidationErrors | null {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    if (selectedDate < currentDate) {
      return { minDate: true };
    }
    return null;
  }
}