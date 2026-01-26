import type { Task } from "../entities/task";
import type { IsoDateString } from "../entities/types";
import type { TimerInterval } from "../entities/timer-interval";
import type { TaskRepository } from "../ports/task-repository";
import type { TimerIntervalRepository } from "../ports/timer-interval-repository";

interface TimerServiceDependencies {
  taskRepository: TaskRepository;
  timerIntervalRepository: TimerIntervalRepository;
  now?: () => Date;
}

export class TimerService {
  private readonly taskRepository: TaskRepository;
  private readonly timerIntervalRepository: TimerIntervalRepository;
  private readonly now: () => Date;

  constructor({ taskRepository, timerIntervalRepository, now }: TimerServiceDependencies) {
    this.taskRepository = taskRepository;
    this.timerIntervalRepository = timerIntervalRepository;
    this.now = now ?? (() => new Date());
  }

  async start(taskId: string): Promise<Task> {
    const task = await this.requireTask(taskId);
    this.ensureTimerMode(task);
    await this.ensureNoOtherRunning(task.id);

    if (task.status === "running") {
      return task;
    }

    if (task.startAt) {
      throw new Error("Timer já iniciado para esta tarefa.");
    }

    const startedAt = this.toIsoString(this.now());
    const interval = this.createInterval(task.id, startedAt);

    await this.timerIntervalRepository.create(interval);

    const updated: Task = {
      ...task,
      status: "running",
      startAt: startedAt,
      durationSeconds: 0,
      updatedAt: startedAt,
    };

    return this.taskRepository.update(updated);
  }

  async pause(taskId: string): Promise<Task> {
    const task = await this.requireTask(taskId);
    this.ensureTimerMode(task);

    if (task.status !== "running") {
      return task;
    }

    const now = this.now();
    const nowIso = this.toIsoString(now);
    const intervals = await this.timerIntervalRepository.listByTaskId(task.id);
    const activeInterval = this.findActiveInterval(intervals);

    if (!activeInterval) {
      throw new Error("Intervalo ativo não encontrado para pausa.");
    }

    const stoppedInterval: TimerInterval = {
      ...activeInterval,
      stoppedAt: nowIso,
    };

    await this.timerIntervalRepository.update(stoppedInterval);

    const durationSeconds = this.calculateDurationSeconds(
      intervals.map((interval) =>
        interval.startedAt === activeInterval.startedAt
          ? stoppedInterval
          : interval,
      ),
      now,
    );

    const updated: Task = {
      ...task,
      status: "paused",
      durationSeconds,
      updatedAt: nowIso,
    };

    return this.taskRepository.update(updated);
  }

  async resume(taskId: string): Promise<Task> {
    const task = await this.requireTask(taskId);
    this.ensureTimerMode(task);
    await this.ensureNoOtherRunning(task.id);

    if (task.status === "running") {
      return task;
    }

    if (!task.startAt) {
      throw new Error("Timer ainda não iniciado.");
    }

    const now = this.now();
    const nowIso = this.toIsoString(now);
    const interval = this.createInterval(task.id, nowIso);

    await this.timerIntervalRepository.create(interval);

    const intervals = await this.timerIntervalRepository.listByTaskId(task.id);
    const durationSeconds = this.calculateDurationSeconds(intervals, now);

    const updated: Task = {
      ...task,
      status: "running",
      durationSeconds,
      updatedAt: nowIso,
    };

    return this.taskRepository.update(updated);
  }

  async end(taskId: string): Promise<Task> {
    const task = await this.requireTask(taskId);
    this.ensureTimerMode(task);

    if (task.status === "finished") {
      return task;
    }

    const now = this.now();
    const nowIso = this.toIsoString(now);
    const intervals = await this.timerIntervalRepository.listByTaskId(task.id);
    const activeInterval = this.findActiveInterval(intervals);

    let normalizedIntervals = intervals;

    if (activeInterval) {
      const stoppedInterval: TimerInterval = {
        ...activeInterval,
        stoppedAt: nowIso,
      };

      await this.timerIntervalRepository.update(stoppedInterval);
      normalizedIntervals = intervals.map((interval) =>
        interval.startedAt === activeInterval.startedAt
          ? stoppedInterval
          : interval,
      );
    }

    const durationSeconds = this.calculateDurationSeconds(normalizedIntervals, now);

    if (durationSeconds <= 0) {
      throw new Error("Duração inválida para finalizar o timer.");
    }

    const updated: Task = {
      ...task,
      status: "finished",
      endAt: nowIso,
      durationSeconds,
      updatedAt: nowIso,
    };

    return this.taskRepository.update(updated);
  }

  private async requireTask(taskId: string): Promise<Task> {
    const task = await this.taskRepository.getById(taskId);

    if (!task) {
      throw new Error("Tarefa não encontrada.");
    }

    return task;
  }

  private ensureTimerMode(task: Task): void {
    if (task.mode !== "timer") {
      throw new Error("A tarefa não usa timer.");
    }
  }

  private async ensureNoOtherRunning(taskId: string): Promise<void> {
    const tasks = await this.taskRepository.list();
    const runningTask = tasks.find(
      (task) => task.status === "running" && task.id !== taskId,
    );

    if (runningTask) {
      throw new Error("Já existe outro timer ativo.");
    }
  }

  private createInterval(taskId: string, startedAt: IsoDateString): TimerInterval {
    return {
      taskId,
      startedAt,
      stoppedAt: null,
    };
  }

  private findActiveInterval(intervals: TimerInterval[]): TimerInterval | null {
    return intervals.find((interval) => !interval.stoppedAt) ?? null;
  }

  private calculateDurationSeconds(intervals: TimerInterval[], now: Date): number {
    return intervals.reduce((total, interval) => {
      const startedAt = Date.parse(interval.startedAt);
      const stoppedAt = interval.stoppedAt
        ? Date.parse(interval.stoppedAt)
        : now.getTime();

      if (Number.isNaN(startedAt) || Number.isNaN(stoppedAt)) {
        return total;
      }

      const delta = Math.max(0, stoppedAt - startedAt);
      return total + Math.floor(delta / 1000);
    }, 0);
  }

  private toIsoString(date: Date): IsoDateString {
    return date.toISOString();
  }
}
