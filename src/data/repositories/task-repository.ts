import type { Task } from "../../domain/entities/task";
import type { TaskRepository } from "../../domain/ports/task-repository";
import { assertValidTask } from "../../domain/services/task-validator";
import { loadDatabase, saveDatabase } from "../storage/storage";

export class LocalTaskRepository implements TaskRepository {
  async create(task: Task): Promise<Task> {
    assertValidTask(task);
    const database = loadDatabase();
    database.tasks = [...database.tasks, task];
    saveDatabase(database);
    return task;
  }

  async update(task: Task): Promise<Task> {
    assertValidTask(task);
    const database = loadDatabase();
    const index = database.tasks.findIndex((stored) => stored.id === task.id);

    if (index >= 0) {
      database.tasks[index] = task;
    } else {
      database.tasks = [...database.tasks, task];
    }

    saveDatabase(database);
    return task;
  }

  async delete(taskId: string): Promise<void> {
    const database = loadDatabase();
    database.tasks = database.tasks.filter((task) => task.id !== taskId);
    database.timerIntervals = database.timerIntervals.filter(
      (interval) => interval.taskId !== taskId,
    );
    saveDatabase(database);
  }

  async getById(taskId: string): Promise<Task | null> {
    const database = loadDatabase();
    return database.tasks.find((task) => task.id === taskId) ?? null;
  }

  async list(options?: { projectId?: string | null }): Promise<Task[]> {
    const database = loadDatabase();
    const projectId = options?.projectId;

    if (projectId === undefined) {
      return [...database.tasks];
    }

    return database.tasks.filter((task) => (task.projectId ?? null) === projectId);
  }
}
