import { Injectable } from '@angular/core';
import { HttpService } from "./http.service";
import { Observable } from "rxjs";
import { Task } from "../models/task";
import { TaskState } from "../models/task-state";

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private readonly _tasksPath = '/api/tasks';

  constructor(
    private httpService: HttpService
  ) {
  }

  getTasks(page: number): Observable<Map<string, Task[]>> {
    return this.httpService.get<Map<string, Task[]>>(`${this._tasksPath}?page=${page}`)
  }

  getTask(id: number): Observable<Task> {
    return this.httpService.get<Task>(`${this._tasksPath}/${id}`)
  }

  addTask(task: Task): Observable<Task> {
    task.userId = +sessionStorage.getItem("userId")!
    return this.httpService.post<Task>(this._tasksPath, task);
  }

  updateTask(task: Task): Observable<Task> {
    task.userId = +sessionStorage.getItem("userId")!
    return this.httpService.put<Task>(this._tasksPath, task)
  }

  deleteTask(id: number): Observable<Task> {
    let url = `${this._tasksPath}/${id}`;
    return this.httpService.delete<Task>(url);
  }

  updateState(id: number, state: TaskState): Observable<void> {
    let url = `${this._tasksPath}/changeState`;
    let updateState = {
      id, state
    }
    console.log(updateState)
    return this.httpService.patch<void>(url, updateState);
  }

}
