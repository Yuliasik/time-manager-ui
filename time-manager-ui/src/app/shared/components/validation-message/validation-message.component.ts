import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-validation-message',
  templateUrl: './validation-message.component.html',
  styleUrls: ['./validation-message.component.scss']
})
export class ValidationMessageComponent {

  internalCondition: boolean = false
  externalCondition: boolean = false

  @Input()
  set condition(condition: boolean) {
    this.externalCondition = condition
    if (condition) {
      this.setInternalCondition(condition)
    } else {
      this.setInternalCondition(condition, 1000)
    }
  }

  get condition() {
    return this.internalCondition;
  }

  constructor() {
  }

  setInternalCondition(condition: boolean, delay: number = 0) {
    setTimeout(() => {
      this.internalCondition = condition
    }, delay)
  }

}
