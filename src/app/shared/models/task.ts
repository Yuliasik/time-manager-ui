import { TaskState } from "./task-state";

export class Task {
  userId: number | undefined;

  id?: number;
  title: string | undefined;
  description: string | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
  performanceDate?: string;
  approximatePerformanceTime: string | undefined;
  state?: TaskState;
  priority: number | undefined;

}
