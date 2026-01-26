import type { TimerInterval } from "../../domain/entities/timer-interval";
import type { TimerIntervalRepository } from "../../domain/ports/timer-interval-repository";
import { loadDatabase, saveDatabase } from "../storage/storage";

export class LocalTimerIntervalRepository implements TimerIntervalRepository {
  async create(interval: TimerInterval): Promise<TimerInterval> {
    const database = loadDatabase();
    database.timerIntervals = [...database.timerIntervals, interval];
    saveDatabase(database);
    return interval;
  }

  async update(interval: TimerInterval): Promise<TimerInterval> {
    const database = loadDatabase();
    const index = database.timerIntervals.findIndex(
      (stored) =>
        stored.taskId === interval.taskId &&
        stored.startedAt === interval.startedAt,
    );

    if (index >= 0) {
      database.timerIntervals[index] = interval;
    } else {
      database.timerIntervals = [...database.timerIntervals, interval];
    }

    saveDatabase(database);
    return interval;
  }

  async listByTaskId(taskId: string): Promise<TimerInterval[]> {
    const database = loadDatabase();
    return database.timerIntervals.filter((interval) => interval.taskId === taskId);
  }
}
