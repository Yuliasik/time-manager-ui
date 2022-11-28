import { Component } from "@angular/core";

@Component({
  template: ''
})
export abstract class BaseCreateComponent {

  timerFunc: any;
  flagErroredField: boolean = false

  resolveClassWithError(error: boolean): string {
    if (error) {
      this.flagErroredField = true
    } else {
      this.resolveAfterSeconds(999, false).then((value: boolean) => {
        this.flagErroredField = value
      })
    }
    return this.flagErroredField ? 'mat-form-with-error' : '';
  }

  resolveAfterSeconds(delay: number, x: boolean): Promise<boolean> {
    return new Promise(resolve => {
      clearTimeout(this.timerFunc)
      this.timerFunc = setTimeout(() => {
        resolve(x);
      }, delay);
    });
  }

}
