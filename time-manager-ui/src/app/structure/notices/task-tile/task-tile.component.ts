import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from "../../../shared/models/task";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { TaskDeleteComponent } from "../../task/task-delete/task-delete.component";
import { TaskCreateComponent } from "../../task/task-create/task-create.component";
import { TaskState } from "../../../shared/models/task-state";
import { TasksService } from "../../../shared/services/tasks.service";

@Component({
  selector: 'app-task-tile',
  templateUrl: './task-tile.component.html',
  styleUrls: ['./task-tile.component.scss']
})
export class TaskTileComponent implements OnInit {

  dialogConfig = new MatDialogConfig();
  @Input() task!: Task;
  @Output() deletedTask = new EventEmitter<any>();
  @Output() updatedTask = new EventEmitter<any>();

  taskStates: TaskState[] = [
    TaskState.PLANNED,
    TaskState.COMPLETED,
    TaskState.PROGRESS,
    TaskState.CANCELED
  ]

  constructor(
    public dialog: MatDialog,
    private tasksService: TasksService
  ) {
  }

  ngOnInit(): void {
  }

  onDeleteClick() {
    this.dialogConfigurationWithTask();
    const dialogRef = this.dialog.open(TaskDeleteComponent, this.dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.data) {
        this.deletedTask.emit(this.task)
      }
    });
  }

  onEditClick() {
    this.dialogConfigurationWithTask();
    const dialogRef = this.dialog.open(TaskCreateComponent, this.dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.data) {
        this.updatedTask.emit(result.data)
      }
    });
  }

  private dialogConfigurationWithTask() {
    this.dialogConfig.hasBackdrop = true
    this.dialogConfig.disableClose = true
    this.dialogConfig.data = {
      task: this.task
    }
  }

  updateState() {
    this.tasksService.updateState(this.task.id!, this.task.state!).subscribe();
  }

}
