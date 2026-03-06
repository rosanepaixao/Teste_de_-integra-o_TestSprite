import { create } from "zustand";
import { LocalProjectRepository } from "../../../data/repositories/project-repository";
import { LocalTaskRepository } from "../../../data/repositories/task-repository";
import { LocalTimerIntervalRepository } from "../../../data/repositories/timer-interval-repository";
import type { Project } from "../../../domain/entities/project";
import type { Task } from "../../../domain/entities/task";
import type { TaskMode, TaskStatus } from "../../../domain/entities/types";
import { TimerService } from "../../../domain/services/timer-service";
import { ProjectUseCases } from "../../../application/project/project-use-cases";
import { TaskUseCases } from "../../../application/task/task-use-cases";
import { secondsToHoursMinutes } from "../../../shared/utils/time";

const projectRepository = new LocalProjectRepository();
const taskRepository = new LocalTaskRepository();
const timerIntervalRepository = new LocalTimerIntervalRepository();
const timerService = new TimerService({ taskRepository, timerIntervalRepository });
const projectUseCases = new ProjectUseCases({ projectRepository });
const taskUseCases = new TaskUseCases({ taskRepository, timerService });

export type ToastTone = "success" | "warning" | "error";

interface ReportSummary {
  totalHours: string;
  totalTasks: number;
}

function toDateRange(start: string, end: string) {
  if (!start && !end) {
    return undefined;
  }

  const startDate = start ? new Date(`${start}T00:00:00.000`) : new Date(`${end}T00:00:00.000`);
  const endDate = end ? new Date(`${end}T23:59:59.999`) : new Date(`${start}T23:59:59.999`);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return undefined;
  }

  return {
    start: startDate.toISOString(),
    end: endDate.toISOString(),
  };
}

interface TaskFormState {
  taskName: string;
  projectId: string;
  filterProjectId: string;
  filterStartDate: string;
  filterEndDate: string;
  isTaskFormOpen: boolean;
  mode: TaskMode;
  hours: string;
  minutes: string;
  taskNameError: string;
  durationError: string;
  projectError: string;
  projects: Project[];
  tasks: Task[];
  taskListState: string;
  reportState: string;
  reportSummary: ReportSummary | null;
  timerStatus: TaskStatus | "stopped";
  elapsedSeconds: number;
  currentTimerTaskId: string | null;
  toast: { message: string; tone: ToastTone; visible: boolean };
  initialize: () => Promise<void>;
  openTaskForm: () => void;
  closeTaskForm: () => void;
  setTaskName: (value: string) => void;
  setProjectId: (value: string) => void;
  setFilterProjectId: (value: string) => void;
  setFilterStartDate: (value: string) => void;
  setFilterEndDate: (value: string) => void;
  clearFilters: () => void;
  setMode: (value: TaskMode) => void;
  setHours: (value: string) => void;
  setMinutes: (value: string) => void;
  createProject: (name: string) => Promise<void>;
  renameProject: (projectId: string, name: string) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  submitManualTask: () => Promise<void>;
  startTimer: () => Promise<void>;
  pauseTimer: () => Promise<void>;
  stopTimer: () => Promise<void>;
  tickTimer: () => void;
  setToast: (message: string, tone?: ToastTone) => void;
  clearToast: () => void;
  refreshTasks: () => Promise<void>;
  refreshReport: () => Promise<void>;
  refreshProjects: () => Promise<void>;
}

export const useTaskFormStore = create<TaskFormState>((set, get) => ({
  taskName: "",
  projectId: "",
  filterProjectId: "",
  filterStartDate: "",
  filterEndDate: "",
  isTaskFormOpen: false,
  mode: "manual",
  hours: "",
  minutes: "",
  taskNameError: "",
  durationError: "",
  projectError: "",
  projects: [],
  tasks: [],
  taskListState: "loading",
  reportState: "loading",
  reportSummary: null,
  timerStatus: "stopped",
  elapsedSeconds: 0,
  currentTimerTaskId: null,
  toast: { message: "", tone: "success", visible: false },
  initialize: async () => {
    await get().refreshProjects();
    await get().refreshTasks();
    await get().refreshReport();
  },
  openTaskForm: () => set({ isTaskFormOpen: true }),
  closeTaskForm: () => set({ isTaskFormOpen: false }),
  setTaskName: (value) => set({ taskName: value, taskNameError: "" }),
  setProjectId: (value) => set({ projectId: value }),
  setFilterProjectId: (value) => set({ filterProjectId: value }),
  setFilterStartDate: (value) => set({ filterStartDate: value }),
  setFilterEndDate: (value) => set({ filterEndDate: value }),
  clearFilters: () => set({ filterProjectId: "", filterStartDate: "", filterEndDate: "" }),
  setMode: (value) => set({ mode: value, durationError: "" }),
  setHours: (value) => set({ hours: value, durationError: "" }),
  setMinutes: (value) => set({ minutes: value, durationError: "" }),
  createProject: async (name) => {
    try {
      await projectUseCases.create(name);
      await get().refreshProjects();
      set({ projectError: "" });
      get().setToast("Projeto adicionado com sucesso.");
    } catch (error) {
      set({ projectError: error instanceof Error ? error.message : "Erro ao criar projeto." });
    }
  },
  renameProject: async (projectId, name) => {
    try {
      await projectUseCases.rename(projectId, name);
      await get().refreshProjects();
      set({ projectError: "" });
      get().setToast("Projeto renomeado.");
    } catch (error) {
      set({ projectError: error instanceof Error ? error.message : "Erro ao renomear." });
    }
  },
  deleteProject: async (projectId) => {
    try {
      await projectUseCases.remove(projectId);
      await get().refreshProjects();
      get().setToast("Projeto removido.");
    } catch (error) {
      set({ projectError: error instanceof Error ? error.message : "Erro ao remover." });
    }
  },
  deleteTask: async (taskId) => {
    try {
      await taskUseCases.delete(taskId);

      if (get().currentTimerTaskId === taskId) {
        set({ timerStatus: "stopped", elapsedSeconds: 0, currentTimerTaskId: null });
      }

      await get().refreshTasks();
      await get().refreshReport();
      get().setToast("Tarefa excluida.");
    } catch (error) {
      get().setToast(
        error instanceof Error ? error.message : "Erro ao excluir tarefa.",
        "error",
      );
    }
  },
  submitManualTask: async () => {
    const { taskName, projectId, hours, minutes } = get();
    const totalMinutes = Number(hours || 0) * 60 + Number(minutes || 0);

    if (!taskName.trim()) {
      set({ taskNameError: "Informe um nome." });
      return;
    }

    if (totalMinutes <= 0) {
      set({ durationError: "Informe um tempo maior que zero." });
      return;
    }

    try {
      await taskUseCases.createManualTask({
        name: taskName,
        projectId: projectId || null,
        durationSeconds: totalMinutes * 60,
      });

      set({ taskName: "", hours: "", minutes: "", taskNameError: "", durationError: "" });
      await get().refreshTasks();
      await get().refreshReport();
      set({ isTaskFormOpen: false });
      get().setToast("Tarefa manual salva.");
    } catch (error) {
      get().setToast(
        error instanceof Error ? error.message : "Erro ao salvar tarefa.",
        "error",
      );
    }
  },
  startTimer: async () => {
    const { taskName, projectId, currentTimerTaskId, timerStatus } = get();

    if (!taskName.trim()) {
      set({ taskNameError: "Informe um nome." });
      return;
    }

    try {
      let taskId = currentTimerTaskId;

      if (!taskId || timerStatus === "stopped") {
        const task = await taskUseCases.createTimerTask({
          name: taskName,
          projectId: projectId || null,
        });
        taskId = task.id;
      }

      const updated =
        timerStatus === "paused" && taskId
          ? await taskUseCases.resumeTimer(taskId)
          : await taskUseCases.startTimer(taskId);
      set({
        currentTimerTaskId: updated.id,
        timerStatus: updated.status,
        elapsedSeconds: updated.durationSeconds,
        taskNameError: "",
      });

      get().setToast("Timer iniciado.");
      await get().refreshTasks();
    } catch (error) {
      get().setToast(
        error instanceof Error ? error.message : "Erro ao iniciar o timer.",
        "error",
      );
    }
  },
  pauseTimer: async () => {
    const { currentTimerTaskId } = get();
    if (!currentTimerTaskId) {
      return;
    }

    try {
      const updated = await taskUseCases.pauseTimer(currentTimerTaskId);
      set({ timerStatus: updated.status, elapsedSeconds: updated.durationSeconds });
      get().setToast("Timer pausado.", "warning");
      await get().refreshTasks();
    } catch (error) {
      get().setToast(
        error instanceof Error ? error.message : "Erro ao pausar o timer.",
        "error",
      );
    }
  },
  stopTimer: async () => {
    const { currentTimerTaskId } = get();
    if (!currentTimerTaskId) {
      return;
    }

    try {
      const updated = await taskUseCases.stopTimer(currentTimerTaskId);
      set({
        timerStatus: "stopped",
        elapsedSeconds: updated.durationSeconds,
        currentTimerTaskId: null,
      });
      get().setToast("Timer finalizado.");
      await get().refreshTasks();
      await get().refreshReport();
    } catch (error) {
      get().setToast(
        error instanceof Error ? error.message : "Erro ao finalizar o timer.",
        "error",
      );
    }
  },
  tickTimer: () => {
    const { timerStatus, elapsedSeconds } = get();
    if (timerStatus !== "running") {
      return;
    }
    set({ elapsedSeconds: elapsedSeconds + 1 });
  },
  setToast: (message, tone = "success") => {
    set({ toast: { message, tone, visible: true } });
  },
  clearToast: () => {
    set({ toast: { message: "", tone: "success", visible: false } });
  },
  refreshTasks: async () => {
    set({ taskListState: "loading" });
    const { filterProjectId, filterStartDate, filterEndDate } = get();
    const dateRange = toDateRange(filterStartDate, filterEndDate);
    const normalizedProject =
      filterProjectId === "none" ? null : filterProjectId ? filterProjectId : undefined;

    const tasks =
      dateRange || filterProjectId
        ? await taskUseCases.listFiltered({ projectId: normalizedProject, dateRange })
        : await taskUseCases.listRecent(8);

    set({ tasks, taskListState: tasks.length ? "" : "empty" });
  },
  refreshReport: async () => {
    set({ reportState: "loading" });
    const { filterProjectId, filterStartDate, filterEndDate } = get();
    const dateRange = toDateRange(filterStartDate, filterEndDate);
    const normalizedProject =
      filterProjectId === "none" ? null : filterProjectId ? filterProjectId : undefined;

    const tasks =
      dateRange || filterProjectId
        ? await taskUseCases.listFiltered({ projectId: normalizedProject, dateRange })
        : await taskUseCases.listAll();
    if (tasks.length === 0) {
      set({ reportSummary: null, reportState: "empty" });
      return;
    }

    const totalSeconds = tasks.reduce((sum, task) => sum + task.durationSeconds, 0);
    set({
      reportSummary: {
        totalHours: secondsToHoursMinutes(totalSeconds),
        totalTasks: tasks.length,
      },
      reportState: "",
    });
  },
  refreshProjects: async () => {
    const projects = await projectUseCases.listAll();
    set({ projects });
  },
}));

export const getProjectName = (projects: Project[], projectId?: string | null): string => {
  if (!projectId) {
    return "Sem projeto";
  }

  const project = projects.find((entry) => entry.id === projectId);
  if (!project) {
    return "Projeto removido";
  }

  return project.name;
};
