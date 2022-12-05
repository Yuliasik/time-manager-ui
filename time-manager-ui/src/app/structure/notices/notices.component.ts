import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { TaskCreateComponent } from "../task/task-create/task-create.component";
import { TasksService } from "../../shared/services/tasks.service";
import { Task } from "../../shared/models/task";
import { map } from "rxjs";
import { DialogComponent } from "../../shared/components/dialog/dialog.component";
import MagicGrid from "magic-grid";

const MAX_COUNT_ON_ONE_PAGE = 12

@Component({
  selector: 'app-notices',
  templateUrl: './notices.component.html',
  styleUrls: ['./notices.component.scss'],
})
export class NoticesComponent implements OnInit, AfterContentChecked {

  dialogConfig = new MatDialogConfig();
  allTasks: Map<string, Task[]> = new Map<string, Task[]>();
  dates: string[] = [];
  isTasksPassed: boolean = false
  magicGrid: MagicGrid | undefined
  page = 0

  constructor(
    private taskService: TasksService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.getTasksFromApi();
  }

  ngAfterContentChecked() {
    if (this.isTasksPassed) {
      this.magicGrid = new MagicGrid({
        container: '.tasks',
        items: this.allTasks.size,
        animate: true,
        gutter: 20,
        static: false,
        useMin: true
      });
      this.magicGrid.listen();
      this.magicGrid.positionItems();
      this.isTasksPassed = false;
    }
    if (this.magicGrid) {
      this.magicGrid.positionItems();
    }
  }

  onScrollDown() {
    this.page++;
    this.getTasksFromApi();
  }

  addTask() {
    this.dialogConfig.hasBackdrop = true
    this.dialogConfig.disableClose = true
    const dialogRef = this.dialog.open(TaskCreateComponent, this.dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.data) {
        for (const task of result.data) {
          this.addNewTaskToView(task);
        }
        this.isTasksPassed = true
      }
    });
  }

  private getTasksFromApi() {
    this.taskService.getTasks(this.page)
      .pipe(
        map(response => {
          return new Map<string, Task[]>(Object.entries(response));
        })).subscribe(
      response => {
        let newTasks = response;
        let newDates = Array.from(newTasks.keys()).sort();
        for (const date of newDates) {
          if (!this.allTasks.get(date)) {
            this.dates.push(date)
            this.allTasks.set(date, newTasks.get(date)!)
          }
        }
        this.isTasksPassed = true
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

  private addNewTaskToView(task: Task) {
    const dateString = task.performanceDate!
    const data = new Date(dateString).getTime()
    let tasks = this.allTasks.get(dateString);
    if (tasks) {
      tasks.push(task)
      return;
    }
    let length = this.dates.length;
    if ((new Date(this.dates[0]).getTime() < data && data < new Date(this.dates[length - 1]).getTime())
      || length < MAX_COUNT_ON_ONE_PAGE) {
      this.allTasks.set(dateString, [task])
      this.dates = Array.from(this.allTasks.keys()).sort();
    }
  }

}
