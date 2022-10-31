import { Component, OnInit } from '@angular/core';
import { TestService } from "../services/test.service";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  time: string | undefined;

  constructor(
    private testService: TestService
  ) {
  }

  ngOnInit(): void {
  }

  getTime() {
    this.testService.getTime().subscribe(newTime => {
        this.time = newTime
      }
    );
  }
}


