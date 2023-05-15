import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
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
import { formatDate } from "@angular/common";
import { TaskAction } from "../../../shared/models/task-action";
import { TaskState } from "../../../shared/models/task-state";

const today = new Date();

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss'],
})
export class TaskCreateComponent extends BaseCreateComponent implements OnInit {

  private task = new Task();
  private readonly receivedTask: Task | undefined
  private readonly actionForTask: TaskAction | undefined

  dialogConfig = new MatDialogConfig();
  taskForm!: FormGroup
  tasksFromApi: Task[] = [];
  actionForTitle = 'Add'
  isEdit: boolean = false
  isDuplicate: boolean = false
  performanceDate: string | undefined

  taskStates: TaskState[] = [
    TaskState.PLANNED,
    TaskState.COMPLETED,
    TaskState.PROGRESS,
    TaskState.CANCELED
  ]

  constructor(
    public dialog: MatDialog,
    private tasksService: TasksService,
    private dialogRef: MatDialogRef<TaskCreateComponent>,
    private dateAdapter: DateAdapter<Date>,
    private formBuilder: FormBuilder,
    @Inject(LOCALE_ID) public locale: string,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    super();
    this.actionForTask = data?.action;
    this.receivedTask = data?.task;
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit(): void {
    this.initTaskForm();
    switch (this.actionForTask) {
      case TaskAction.EDIT:
        this.isEdit = true
        this.actionForTitle = 'Edit'
        this.fillTaskForm();
        break;
      case TaskAction.DUPLICATE:
        this.isDuplicate = true
        this.actionForTitle = 'Duplicate'
        this.fillTaskForm();
        break;
    }
  }

  onCancelClick() {
    this.dialogRef.close({data: this.tasksFromApi});
    this.tasksFromApi = []
  }

  onSubmitClick() {
    if (this.isEdit) {
      this.editTask();
    } else if (this.isDuplicate) {
      this.duplicateTask();
    } else {
      this.addTask();
    }
  }

  private editTask() {
    this.tasksService.updateTask(this.getTaskFromForm()).subscribe(taskFromApi => {
        this.dialogRef.close({data: taskFromApi});
      },
      (errorRes) => {
        this.errorHandling(errorRes);
      }
    )
  }

  private duplicateTask() {
    this.task.userId = +sessionStorage.getItem("userId")!
    this.tasksService.addTask(this.getTaskFromForm()).subscribe(taskFromApi => {
        this.dialogRef.close({data: taskFromApi});
      },
      (errorRes) => {
        this.errorHandling(errorRes);
      }
    )
  }

  private addTask() {
    this.task.userId = +sessionStorage.getItem("userId")!
    this.tasksService.addTask(this.getTaskFromForm()).subscribe(taskFromApi => {
        this.tasksFromApi.push(taskFromApi);
        if (!this.getValueOf("check")) {
          this.dialogRef.close({data: this.tasksFromApi});
          this.tasksFromApi = [];
        }
        this.resetForm();
      },
      (errorRes) => {
        this.errorHandling(errorRes);
      }
    )
  }

  private initTaskForm() {
    this.taskForm = this.formBuilder.group({
      title: new FormControl("", [Validators.required, this.validatorEmptyLine(), Validators.maxLength(50)]),
      description: new FormControl("", Validators.maxLength(500)),
      startDate: new FormControl(today, Validators.required),
      endDate: new FormControl(today, Validators.required),
      priority: new FormControl(2, Validators.required),
      hours: new FormControl(0, Validators.required),
      minutes: new FormControl(0, Validators.required),
      check: new FormControl(false)
    })
  }

  private fillTaskForm() {
    this.taskForm.addControl("state", new FormControl(today, Validators.required))
    this.taskForm.patchValue({
      title: this.receivedTask?.title,
      description: this.receivedTask?.description,
      startDate: this.receivedTask?.startDate,
      endDate: this.receivedTask?.endDate,
      priority: this.receivedTask?.priority,
      hours: this.getHourFromApiFormat(this.receivedTask?.approximatePerformanceTime!),
      minutes: this.getMinuteFromApiFormat(this.receivedTask?.approximatePerformanceTime!),
      state: this.receivedTask?.state
    })
    this.performanceDate = this.getBeautifulDate(this.receivedTask?.performanceDate!)
  }

  private getBeautifulDate(date: string): string {
    let dateAfterFormat = date?.split("-")
    return dateAfterFormat.reverse().join(".")
  }

  private getHourFromApiFormat(timeFormat: string): string {
    return timeFormat.split(":")[0];
  }

  private getMinuteFromApiFormat(timeFormat: string): string {
    return timeFormat.split(":")[1];
  }

  private resetForm() {
    this.taskForm.reset({
      title: "",
      description: "",
      startDate: today,
      endDate: today,
      priority: 2,
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
    task.startDate = formatDate(this.getValueOf("startDate"), 'y-MM-dd', this.locale);
    task.endDate = formatDate(this.getValueOf("endDate"), 'y-MM-dd', this.locale);
    task.approximatePerformanceTime = this.getValueOf("hours") + ":" + this.getValueOf("minutes")
    task.priority = this.getValueOf("priority");
    if (this.isEdit) {
      task.id = this.receivedTask?.id
      task.state = this.getValueOf("state");
    }
    return task;
  }

  private errorHandling(errorRes: any) {
    this.dialogConfig.hasBackdrop = true
    this.dialogConfig.disableClose = true
    this.dialogConfig.data = {
      message: errorRes.error
    }
    this.dialog.open(DialogComponent, this.dialogConfig);
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
