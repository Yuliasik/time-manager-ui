import { Component, OnInit } from '@angular/core';
import { Settings } from "../../shared/models/settintgs";
import { SettingsService } from "../../shared/services/settings.service";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { BaseCreateComponent } from "../BaseCreateComponent";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent extends BaseCreateComponent implements OnInit {

  settingsForm!: FormGroup
  settings = new Settings();

  constructor(
    private formBuilder: FormBuilder,
    private settingService: SettingsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initSettingsForm();
    this.getSettingsFromApi();
  }


  private getSettingsFromApi() {
    this.settingService.getSettings().subscribe((settings: Settings) => {
      this.settings = settings;
      this.fillSettingsForm();
    })
  }

  private initSettingsForm() {
    this.settingsForm = this.formBuilder.group({
      durationHour: new FormControl(8, [Validators.required, Validators.min(1), Validators.max(24)]),
      bufferPercentage: new FormControl(10, [Validators.required, Validators.min(0), Validators.max(100)])
    })
  };

  // validatorPositiveNumber(): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     let result: boolean
  //     result = control.value <= 0;
  //     return result ? {"positiveNumber": {value: control.value}} : null;
  //   }
  // }

  private fillSettingsForm() {
    this.settingsForm.patchValue({
      durationHour: this.settings.durationHour,
      bufferPercentage: this.settings.bufferPercentage,
    })
  }

  onSubmitClick() {
    this.settingService.updateSettings(this.getSettingsFromForm()).subscribe(() =>
      this.settingsForm.markAsPristine()
    );
  }

  private getSettingsFromForm(): Settings {
    let settings = new Settings();
    settings.durationHour = this.getValueOf("durationHour");
    settings.bufferPercentage = this.getValueOf("bufferPercentage");
    settings.id = this.settings.id;
    return settings;
  }

  private getValueOf(field: string) {
    return this.settingsForm.get(field)?.value
  }
}
