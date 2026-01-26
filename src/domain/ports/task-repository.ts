import type { IsoDateString } from "../entities/types";
import type { Task } from "../entities/task";

export interface TaskDateRangeFilter {
  start: IsoDateString;
  end: IsoDateString;
}

export interface TaskListOptions {
  projectId?: string | null;
  dateRange?: TaskDateRangeFilter;
  offset?: number;
  limit?: number;
}

export interface TaskRepository {
  create(task: Task): Promise<Task>;
  update(task: Task): Promise<Task>;
  delete(taskId: string): Promise<void>;
  getById(taskId: string): Promise<Task | null>;
  list(options?: TaskListOptions): Promise<Task[]>;
}
