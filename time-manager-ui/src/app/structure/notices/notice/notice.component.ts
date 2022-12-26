import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output } from '@angular/core';
import { Task } from "../../../shared/models/task";
import { formatDate } from "@angular/common";

@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.scss']
})
export class NoticeComponent implements OnInit {

  @Input() taskForOneDate!: Task[];
  @Input() date!: string;
  @Output() deletedTask = new EventEmitter<any>();
  @Output() updatedTask = new EventEmitter<any>();
  @Output() duplicatedTask = new EventEmitter<any>();

  dateAfterFormat: string | undefined
  weekday: string | undefined

  constructor(
    @Inject(LOCALE_ID) public locale: string
  ) {
  }

  ngOnInit(): void {
    this.dateAfterFormat = this.getDate();
    this.weekday = this.getWeekday();
  }

  getDate(): string {
    let dateAfterFormat = this.date?.split("-")
    return dateAfterFormat.reverse().join(".")
  }

  getWeekday(): string {
    return formatDate(new Date(this.date), 'EEEE', this.locale);
  }

  isToday(): boolean {
    return this.dateAfterFormat === formatDate(new Date(), 'dd.M.y', this.locale);
  }

  transferDeletedTask(task: Task) {
    this.deletedTask.emit(task)
  }

  transferUpdatedTask(task: Task) {
    this.updatedTask.emit(task)
  }

  transferDuplicatedTask(task: Task) {
    this.duplicatedTask.emit(task)
  }

}
