import { AfterViewChecked, Component, OnInit } from '@angular/core';
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
    const taskPerformanceDateString = task.performanceDate!
    const taskPerformanceDate = new Date(taskPerformanceDateString).getTime()
    let tasks = this.allTasks.get(taskPerformanceDateString);
    if (tasks) {
      tasks.push(task)
      return;
    }
    if (this.isPerformanceDateInRange(taskPerformanceDate)) {
      this.allTasks.set(taskPerformanceDateString, [task])
      this.dates = Array.from(this.allTasks.keys()).sort();
    }
  }

  deleteTask(task: Task) {
    const performanceDate = task.performanceDate!
    let tasks = this.allTasks.get(performanceDate);
    if (tasks) {
      tasks.splice(tasks.indexOf(task), 1);
      if (tasks.length == 0) {
        this.dates.splice(this.dates.indexOf(performanceDate), 1);
      }
    }
  }

  updateTask(updatedTask: Task) {
    const performanceDateUpdatedTaskString = updatedTask.performanceDate!
    const performanceDateUpdatedTask = new Date(performanceDateUpdatedTaskString).getTime()
    const oldTask = this.getTaskFromMapById(updatedTask.id!);
    const performanceDateOldTask = oldTask?.performanceDate;

    if (performanceDateOldTask === performanceDateUpdatedTaskString) {
      let allTasksByPerformanceDate = this.allTasks.get(performanceDateUpdatedTaskString)!;
      allTasksByPerformanceDate[allTasksByPerformanceDate.indexOf(oldTask!)] = updatedTask;
      return
    }
    if (this.dates.includes(performanceDateUpdatedTaskString)) {
      this.allTasks.get(performanceDateUpdatedTaskString)!.push(updatedTask)
    } else {
      if (this.isPerformanceDateInRange(performanceDateUpdatedTask)) {
        this.allTasks.set(performanceDateUpdatedTaskString, [updatedTask])
        this.dates = Array.from(this.allTasks.keys()).sort();
      }
    }
    let allTasksByPerformanceDateOldTask = this.allTasks.get(performanceDateOldTask!)!;
    allTasksByPerformanceDateOldTask.splice(allTasksByPerformanceDateOldTask.indexOf(oldTask!), 1);
    if (allTasksByPerformanceDateOldTask.length == 0) {
      this.allTasks.delete(performanceDateOldTask!)
      this.dates.splice(this.dates.indexOf(performanceDateOldTask!), 1);
    }
    this.isTasksPassed = true
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
