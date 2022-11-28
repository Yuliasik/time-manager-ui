import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { DateAdapter } from "@angular/material/core";
import { TasksService } from "../../../shared/services/tasks.service";
import { DialogComponent } from "../../../shared/components/dialog/dialog.component";
import { Task } from "../../../shared/models/task";
import { BaseCreateComponent } from "../../BaseCreateComponent";

const today = new Date();

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss'],
})
export class TaskCreateComponent extends BaseCreateComponent implements OnInit {

  private task = new Task();
  dialogConfig = new MatDialogConfig();
  taskForm!: FormGroup


  constructor(
    public dialog: MatDialog,
    private tasksService: TasksService,
    private dialogRef: MatDialogRef<TaskCreateComponent>,
    private dateAdapter: DateAdapter<Date>,
    private formBuilder: FormBuilder
  ) {
    super();
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit(): void {
    this.initTaskForm();
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  onSubmitClick() {
    this.task.userId = +sessionStorage.getItem("userId")!
    this.tasksService.addTask(this.getTaskFromForm()).subscribe(() => {
        if (!this.getValueOf("check")) {
          this.dialogRef.close();
        }
        this.resetForm();
      },
      (errorRes) => {
        this.dialogConfig.hasBackdrop = true
        this.dialogConfig.disableClose = true
        this.dialogConfig.data = {
          message: errorRes.error
        }
        this.dialog.open(DialogComponent, this.dialogConfig);
      }
    )
  }

  private initTaskForm() {
    this.taskForm = this.formBuilder.group({
      title: new FormControl("", [Validators.required, this.validatorEmptyLine(), Validators.maxLength(50)]),
      description: new FormControl(""),
      startDate: new FormControl(today, Validators.required),
      endDate: new FormControl(today, Validators.required),
      hours: new FormControl(0, Validators.required),
      minutes: new FormControl(0, Validators.required),
      check: new FormControl(false)
    })
  }

  private resetForm() {
    this.taskForm.reset({
      title: "",
      description: "",
      startDate: today,
      endDate: today,
      hours: 0,
      minutes: 0,
      check: true
    });
  }

  private getValueOf(field: string) {
    return this.taskForm.get(field)?.value
  }

  private getTaskFromForm(): Task {
    let task = new Task();
    task.title = this.getValueOf("title");
    task.description = this.getValueOf("description");
    task.startDate = this.getValueOf("startDate");
    task.endDate = this.getValueOf("endDate");
    task.approximatePerformanceTime = this.getValueOf("hours") + ":" + this.getValueOf("minutes")
    return task;
  }

  validatorEmptyLine(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let result: boolean
      result = control.value !== undefined && !control.value && control.value.length === 0
      return result ? {"emptyLine": {value: control.value}} : null;
    }
  }

  isEnteredApproximatePerformanceTime(): boolean {
    return this.getValueOf("hours") === 0 && this.getValueOf("minutes") === 0
  }
}
