import type { Task } from "../../domain/entities/task";
import type { TaskDateRangeFilter, TaskRepository } from "../../domain/ports/task-repository";
import type { TimerService } from "../../domain/services/timer-service";

interface TaskUseCasesDependencies {
  taskRepository: TaskRepository;
  timerService: TimerService;
  now?: () => Date;
}

export class TaskUseCases {
  private readonly taskRepository: TaskRepository;
  private readonly timerService: TimerService;
  private readonly now: () => Date;

  constructor({ taskRepository, timerService, now }: TaskUseCasesDependencies) {
    this.taskRepository = taskRepository;
    this.timerService = timerService;
    this.now = now ?? (() => new Date());
  }

  async listRecent(limit = 5): Promise<Task[]> {
    return this.taskRepository.list({ limit });
  }

  async listFiltered(options: {
    projectId?: string | null;
    dateRange?: TaskDateRangeFilter;
    limit?: number;
  }): Promise<Task[]> {
    return this.taskRepository.list({
      projectId: options.projectId,
      dateRange: options.dateRange,
      limit: options.limit,
    });
  }

  async createManualTask(params: {
    name: string;
    projectId: string | null;
    durationSeconds: number;
  }): Promise<Task> {
    const trimmed = params.name.trim();
    if (!trimmed) {
      throw new Error("Nome da tarefa é obrigatório.");
    }

    if (params.durationSeconds <= 0) {
      throw new Error("Duração deve ser maior que zero.");
    }

    const nowIso = this.now().toISOString();
    const task: Task = {
      id: crypto.randomUUID ? crypto.randomUUID() : `task-${Date.now()}`,
      name: trimmed,
      projectId: params.projectId,
      mode: "manual",
      status: "finished",
      durationSeconds: Math.floor(params.durationSeconds),
      loggedAt: nowIso,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    return this.taskRepository.create(task);
  }

  async createTimerTask(params: { name: string; projectId: string | null }): Promise<Task> {
    const trimmed = params.name.trim();
    if (!trimmed) {
      throw new Error("Nome da tarefa é obrigatório.");
    }

    const nowIso = this.now().toISOString();
    const task: Task = {
      id: crypto.randomUUID ? crypto.randomUUID() : `task-${Date.now()}`,
      name: trimmed,
      projectId: params.projectId,
      mode: "timer",
      status: "paused",
      durationSeconds: 0,
      startAt: null,
      endAt: null,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    return this.taskRepository.create(task);
  }

  async startTimer(taskId: string): Promise<Task> {
    return this.timerService.start(taskId);
  }

  async pauseTimer(taskId: string): Promise<Task> {
    return this.timerService.pause(taskId);
  }

  async resumeTimer(taskId: string): Promise<Task> {
    return this.timerService.resume(taskId);
  }

  async stopTimer(taskId: string): Promise<Task> {
    return this.timerService.end(taskId);
  }

  async delete(taskId: string): Promise<void> {
    await this.taskRepository.delete(taskId);
  }

  async listAll(): Promise<Task[]> {
    return this.taskRepository.list();
  }
}
