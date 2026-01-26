import type { Project } from "../entities/project";
import type { IsoDateString } from "../entities/types";
import type { Task } from "../entities/task";
import type { ProjectRepository } from "../ports/project-repository";
import type { TaskRepository } from "../ports/task-repository";

export interface ReportDateRange {
  start: IsoDateString;
  end: IsoDateString;
}

export interface ReportTotals {
  totalSeconds: number;
  totalTasks: number;
}

export type ProjectReportCategory = "active" | "unassigned" | "removed";

export interface ProjectReportEntry {
  projectId: string | null;
  projectName: string;
  category: ProjectReportCategory;
  totalSeconds: number;
  totalTasks: number;
}

export interface ReportResult {
  period: ReportDateRange;
  totals: ReportTotals;
  projects: ProjectReportEntry[];
}

const UNASSIGNED_KEY = "unassigned";
const REMOVED_KEY = "removed";

export class ReportService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async buildReport(period: ReportDateRange): Promise<ReportResult> {
    const [tasks, projects] = await Promise.all([
      this.taskRepository.list({ dateRange: period }),
      this.projectRepository.list({ includeDeleted: true }),
    ]);

    const projectMap = new Map(projects.map((project) => [project.id, project]));
    const totals = this.calculateTotals(tasks);
    const projectEntries = this.calculateProjectEntries(tasks, projectMap);

    return {
      period,
      totals,
      projects: this.sortProjectEntries(projectEntries),
    };
  }

  private calculateTotals(tasks: Task[]): ReportTotals {
    return tasks.reduce<ReportTotals>(
      (totals, task) => {
        return {
          totalSeconds: totals.totalSeconds + task.durationSeconds,
          totalTasks: totals.totalTasks + 1,
        };
      },
      { totalSeconds: 0, totalTasks: 0 },
    );
  }

  private calculateProjectEntries(
    tasks: Task[],
    projectMap: Map<string, Project>,
  ): ProjectReportEntry[] {
    const aggregated = new Map<string, ProjectReportEntry>();

    const ensureEntry = (
      key: string,
      entry: Omit<ProjectReportEntry, "totalSeconds" | "totalTasks">,
    ): ProjectReportEntry => {
      const existing = aggregated.get(key);
      if (existing) {
        return existing;
      }
      const created: ProjectReportEntry = {
        ...entry,
        totalSeconds: 0,
        totalTasks: 0,
      };
      aggregated.set(key, created);
      return created;
    };

    tasks.forEach((task) => {
      const projectId = task.projectId ?? null;

      if (!projectId) {
        const entry = ensureEntry(UNASSIGNED_KEY, {
          projectId: null,
          projectName: "Sem projeto",
          category: "unassigned",
        });
        this.applyTask(entry, task);
        return;
      }

      const project = projectMap.get(projectId);
      if (!project || project.status === "deleted") {
        const entry = ensureEntry(REMOVED_KEY, {
          projectId: null,
          projectName: "Projeto removido",
          category: "removed",
        });
        this.applyTask(entry, task);
        return;
      }

      const entry = ensureEntry(`project:${project.id}`, {
        projectId: project.id,
        projectName: project.name,
        category: "active",
      });
      this.applyTask(entry, task);
    });

    return Array.from(aggregated.values());
  }

  private applyTask(entry: ProjectReportEntry, task: Task): void {
    entry.totalSeconds += task.durationSeconds;
    entry.totalTasks += 1;
  }

  private sortProjectEntries(entries: ProjectReportEntry[]): ProjectReportEntry[] {
    const active = entries
      .filter((entry) => entry.category === "active")
      .sort((a, b) => a.projectName.localeCompare(b.projectName, "pt-BR"));
    const unassigned = entries.filter((entry) => entry.category === "unassigned");
    const removed = entries.filter((entry) => entry.category === "removed");
    return [...active, ...unassigned, ...removed];
  }
}
