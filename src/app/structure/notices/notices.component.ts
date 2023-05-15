import {AfterViewChecked, Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {TaskCreateComponent} from "../task/task-create/task-create.component";
import {TasksService} from "../../shared/services/tasks.service";
import {Task} from "../../shared/models/task";
import {map} from "rxjs";
import {DialogComponent} from "../../shared/components/dialog/dialog.component";
import MagicGrid from "magic-grid";

const MAX_COUNT_ON_ONE_PAGE = 12

@Component({
  selector: 'app-notices',
  templateUrl: './notices.component.html',
  styleUrls: ['./notices.component.scss'],
})
export class NoticesComponent implements OnInit, AfterViewChecked {

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

  ngAfterViewChecked() {
    if (this.isTasksPassed && this.allTasks.size > 0) {
      this.initGrid()
      this.isTasksPassed = false;
    }
    if (this.magicGrid) {
      this.magicGrid.positionItems();
    }
  }

  private initGrid() {
    this.magicGrid = new MagicGrid({
      container: '.tasks',
      items: this.allTasks.size,
      animate: true,
      gutter: 20,
      static: false,
      useMin: true
    });
    this.magicGrid.listen();
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
      this.rearrangeTasks();
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

  private rearrangeTasks() {
    let lastPageToLoad = this.page;
    this.allTasks = new Map<string, Task[]>();
    this.dates = [];
    for (let i = 0; i <= lastPageToLoad; i++) {
      this.page = i;
      this.getTasksFromApi();
    }
  }

  private addNewTaskToView(task: Task) {
    this.rearrangeTasks()
  }

  deleteTask(task: Task) {
    this.rearrangeTasks()
  }

  updateTask(updatedTask: Task) {
    this.rearrangeTasks()
  }

  duplicateTask(duplicatedTask: Task) {
    this.addNewTaskToView(duplicatedTask);
  }

  private isPerformanceDateInRange(performanceDate: number) {
    let length = this.dates.length;
    return (new Date(this.dates[0]).getTime() < performanceDate && performanceDate < new Date(this.dates[length - 1]).getTime())
      || length < MAX_COUNT_ON_ONE_PAGE
  }

  private getTaskFromMapById(id: number): Task | undefined {
    let foundedTask: Task | undefined
    for (let date of this.dates) {
      foundedTask = this.allTasks.get(date)!.find(t => t.id === id);
      if (foundedTask) {
        break
      }
    }
    return foundedTask ? foundedTask : undefined;
  }
}
