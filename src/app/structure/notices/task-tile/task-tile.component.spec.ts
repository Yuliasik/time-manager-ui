import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskTileComponent } from './task-tile.component';

describe('TaskTileComponent', () => {
  let component: TaskTileComponent;
  let fixture: ComponentFixture<TaskTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskTileComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TaskTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
