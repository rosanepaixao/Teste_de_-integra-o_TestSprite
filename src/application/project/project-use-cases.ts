import type { Project } from "../../domain/entities/project";
import type { ProjectRepository } from "../../domain/ports/project-repository";

interface ProjectUseCasesDependencies {
  projectRepository: ProjectRepository;
  now?: () => Date;
}

export class ProjectUseCases {
  private readonly projectRepository: ProjectRepository;
  private readonly now: () => Date;

  constructor({ projectRepository, now }: ProjectUseCasesDependencies) {
    this.projectRepository = projectRepository;
    this.now = now ?? (() => new Date());
  }

  async listAll(): Promise<Project[]> {
    return this.projectRepository.list({ includeDeleted: true });
  }

  async create(name: string): Promise<Project> {
    const trimmed = name.trim();
    if (!trimmed) {
      throw new Error("Nome do projeto é obrigatório.");
    }

    await this.ensureUnique(trimmed);

    const nowIso = this.now().toISOString();
    const project: Project = {
      id: crypto.randomUUID ? crypto.randomUUID() : `project-${Date.now()}`,
      name: trimmed,
      status: "active",
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    return this.projectRepository.create(project);
  }

  async rename(projectId: string, name: string): Promise<Project> {
    const trimmed = name.trim();
    if (!trimmed) {
      throw new Error("Nome do projeto é obrigatório.");
    }

    await this.ensureUnique(trimmed, projectId);

    const project = await this.projectRepository.getById(projectId);
    if (!project) {
      throw new Error("Projeto não encontrado.");
    }

    const updated: Project = {
      ...project,
      name: trimmed,
      updatedAt: this.now().toISOString(),
    };

    return this.projectRepository.update(updated);
  }

  async remove(projectId: string): Promise<Project> {
    const deletedAt = this.now().toISOString();
    const updated = await this.projectRepository.softDelete(projectId, deletedAt);

    if (!updated) {
      throw new Error("Projeto não encontrado.");
    }

    return updated;
  }

  private async ensureUnique(name: string, excludeId?: string): Promise<void> {
    const normalized = name.trim().toLocaleLowerCase("pt-BR");
    const projects = await this.projectRepository.list({ includeDeleted: true });
    const duplicate = projects.some(
      (project) =>
        project.id !== excludeId &&
        project.name.trim().toLocaleLowerCase("pt-BR") === normalized,
    );

    if (duplicate) {
      throw new Error("Já existe um projeto com esse nome.");
    }
  }
}
