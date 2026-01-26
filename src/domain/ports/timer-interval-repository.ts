import type { TimerInterval } from "../entities/timer-interval";

export interface TimerIntervalRepository {
  create(interval: TimerInterval): Promise<TimerInterval>;
  update(interval: TimerInterval): Promise<TimerInterval>;
  listByTaskId(taskId: string): Promise<TimerInterval[]>;
}
