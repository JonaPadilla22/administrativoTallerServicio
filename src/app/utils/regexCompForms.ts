import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function regexComp(regexSentence: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const regexIsValid = regexSentence.test(control.value);
      return regexIsValid ?  null : {regexFine: {value: control.value}};
    };
  }