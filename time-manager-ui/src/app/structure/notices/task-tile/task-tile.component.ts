import { Component, Input, OnInit } from '@angular/core';
import { Task } from "../../../shared/models/task";

@Component({
  selector: 'app-task-tile',
  templateUrl: './task-tile.component.html',
  styleUrls: ['./task-tile.component.scss']
})
export class TaskTileComponent implements OnInit {

  @Input() task!: Task;

  constructor() {
  }

  ngOnInit(): void {
  }

}
