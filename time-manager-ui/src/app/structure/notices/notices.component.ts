import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { TaskCreateComponent } from "../task/task-create/task-create.component";

@Component({
  selector: 'app-notices',
  templateUrl: './notices.component.html',
  styleUrls: ['./notices.component.scss'],
})
export class NoticesComponent implements OnInit {

  dialogConfig = new MatDialogConfig();

  constructor(
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
  }

  addTask() {
    this.dialogConfig.hasBackdrop = true
    this.dialogConfig.disableClose = true
    this.dialog.open(TaskCreateComponent, this.dialogConfig);
  }

}
