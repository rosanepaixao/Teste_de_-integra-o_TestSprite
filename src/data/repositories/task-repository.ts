import type { IsoDateString } from "../../domain/entities/types";
import type { Task } from "../../domain/entities/task";
import type { TaskListOptions, TaskRepository } from "../../domain/ports/task-repository";
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

  async list(options?: TaskListOptions): Promise<Task[]> {
    const database = loadDatabase();
    const projectId = options?.projectId;
    const dateRange = options?.dateRange;
    const offset = Math.max(0, options?.offset ?? 0);
    const limit = options?.limit;
    const normalizedProjectId = projectId ?? null;

    const filtered = database.tasks.filter((task) => {
      if (projectId !== undefined && (task.projectId ?? null) !== normalizedProjectId) {
        return false;
      }

      if (!dateRange) {
        return true;
      }

      const referenceDate = this.getReferenceDate(task);

      if (!referenceDate) {
        return false;
      }

      const timestamp = Date.parse(referenceDate);
      const startTimestamp = Date.parse(dateRange.start);
      const endTimestamp = Date.parse(dateRange.end);

      if (Number.isNaN(timestamp) || Number.isNaN(startTimestamp) || Number.isNaN(endTimestamp)) {
        return false;
      }

      return timestamp >= startTimestamp && timestamp <= endTimestamp;
    });

    const sorted = filtered.sort((a, b) => {
      const aTimestamp = this.getReferenceTimestamp(a);
      const bTimestamp = this.getReferenceTimestamp(b);
      return bTimestamp - aTimestamp;
    });

    if (limit === undefined) {
      return sorted.slice(offset);
    }

    return sorted.slice(offset, offset + Math.max(0, limit));
  }

  private getReferenceDate(task: Task): IsoDateString | null {
    if (task.mode === "manual") {
      return task.loggedAt ?? task.createdAt ?? null;
    }

    return task.startAt ?? task.createdAt ?? null;
  }

  private getReferenceTimestamp(task: Task): number {
    const referenceDate = this.getReferenceDate(task);
    const timestamp = referenceDate ? Date.parse(referenceDate) : Number.NaN;
    return Number.isNaN(timestamp) ? 0 : timestamp;
  }
}
