import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from "../../../shared/models/task";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { TaskDeleteComponent } from "../../task/task-delete/task-delete.component";

@Component({
  selector: 'app-task-tile',
  templateUrl: './task-tile.component.html',
  styleUrls: ['./task-tile.component.scss']
})
export class TaskTileComponent implements OnInit {

  dialogConfig = new MatDialogConfig();
  @Input() task!: Task;
  @Output() deletedTask = new EventEmitter<any>();

  constructor(
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
  }

  onDeleteClick() {
    this.dialogConfig.hasBackdrop = true
    this.dialogConfig.disableClose = true
    this.dialogConfig.data = {
      task: this.task
    }
    const dialogRef = this.dialog.open(TaskDeleteComponent, this.dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.data) {
        this.deletedTask.emit(this.task)
      }
    });
  }
}
