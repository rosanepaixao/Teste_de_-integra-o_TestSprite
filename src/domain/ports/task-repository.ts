import type { Task } from "../entities/task";

export interface TaskRepository {
  create(task: Task): Promise<Task>;
  update(task: Task): Promise<Task>;
  delete(taskId: string): Promise<void>;
  getById(taskId: string): Promise<Task | null>;
  list(options?: { projectId?: string | null }): Promise<Task[]>;
}
