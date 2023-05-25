import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from "../../../shared/models/task";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { TaskDeleteComponent } from "../../task/task-delete/task-delete.component";
import { TaskCreateComponent } from "../../task/task-create/task-create.component";
import { TaskState } from "../../../shared/models/task-state";
import { TasksService } from "../../../shared/services/tasks.service";
import { TaskAction } from "../../../shared/models/task-action";

@Component({
  selector: 'app-task-tile',
  templateUrl: './task-tile.component.html',
  styleUrls: ['./task-tile.component.scss']
})
export class TaskTileComponent {

  dialogConfig = new MatDialogConfig();
  @Input() task!: Task;
  @Output() tasksUpdated = new EventEmitter<boolean>();

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

  onDeleteClick() {
    this.dialogConfigurationWithTaskInInput();
    this.dialogConfig.data = {
      task: this.task
    }
    const dialogRef = this.dialog.open(TaskDeleteComponent, this.dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.tasksUpdated) {
        this.tasksUpdated.emit(true)
      }
    });
  }

  onEditClick() {
    this.dialogConfigurationWithTaskInInput();
    this.dialogConfig.data = {
      task: this.task,
      action: TaskAction.EDIT
    }
    const dialogRef = this.dialog.open(TaskCreateComponent, this.dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.tasksUpdated) {
        this.tasksUpdated.emit(true)
      }
    });
  }

  onDuplicateClick() {
    this.dialogConfigurationWithTaskInInput();
    this.dialogConfig.data = {
      task: this.task,
      action: TaskAction.DUPLICATE
    }
    const dialogRef = this.dialog.open(TaskCreateComponent, this.dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.tasksUpdated) {
        this.tasksUpdated.emit(true)
      }
    });
  }

  private dialogConfigurationWithTaskInInput() {
    this.dialogConfig.hasBackdrop = true
    this.dialogConfig.disableClose = true
  }

  updateState() {
    this.tasksService.updateState(this.task.id!, this.task.state!).subscribe();
  }

  parsePerformanceTime(): string {
    let split = this.task.approximatePerformanceTime?.split(":")!;
    let result = "";
    if (split[0] !== "0") {
      result += split[0] + "h ";
    }
    if (split[1] !== "0") {
      result += split[1] + "m";
    }
    return result;
  }

  preventClick($event: MouseEvent) {
    $event.stopPropagation();
  }

}
