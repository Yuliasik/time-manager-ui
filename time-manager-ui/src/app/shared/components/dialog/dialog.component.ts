import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {

  message: string;
  title: string;
  button: string;

  constructor(
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) {
    this.message = data.message ? data.message : "Something went wrong!"
    this.title = data.title ? data.title : "Error"
    this.button = data.button ? data.button : "Close"
  }

  close() {
    this.dialogRef.close();
  }

}
