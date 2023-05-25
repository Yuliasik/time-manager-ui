import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { TasksService } from "../../../shared/services/tasks.service";
import { Task } from "../../../shared/models/task";
import { DialogComponent } from "../../../shared/components/dialog/dialog.component";

@Component({
  selector: 'app-task-delete',
  templateUrl: './task-delete.component.html',
  styleUrls: ['./task-delete.component.scss']
})
export class TaskDeleteComponent implements OnInit {

  dialogConfig = new MatDialogConfig();
  task!: Task

  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<TaskDeleteComponent>,
    private tasksService: TasksService,
    @Inject(MAT_DIALOG_DATA) data: any,
  ) {
    this.task = data.task;
  }

  ngOnInit(): void {
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  onDeleteClick() {
    this.tasksService.deleteTask(this.task.id!).subscribe(() => {
        this.dialogRef.close({tasksUpdated: true});
      },
      (errorRes) => {
        this.dialogConfig.hasBackdrop = true
        this.dialogConfig.disableClose = true
        this.dialogConfig.data = {
          message: errorRes.error
        }
        this.dialog.open(DialogComponent, this.dialogConfig);
      })
  }
}
