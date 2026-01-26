import type { Project } from "../../domain/entities/project";
import type { IsoDateString } from "../../domain/entities/types";
import type { ProjectRepository } from "../../domain/ports/project-repository";
import { loadDatabase, saveDatabase } from "../storage/storage";

export class LocalProjectRepository implements ProjectRepository {
  async create(project: Project): Promise<Project> {
    const database = loadDatabase();
    database.projects = [...database.projects, project];
    saveDatabase(database);
    return project;
  }

  async update(project: Project): Promise<Project> {
    const database = loadDatabase();
    const index = database.projects.findIndex(
      (stored) => stored.id === project.id,
    );

    if (index >= 0) {
      database.projects[index] = project;
    } else {
      database.projects = [...database.projects, project];
    }

    saveDatabase(database);
    return project;
  }

  async softDelete(
    projectId: string,
    deletedAt: IsoDateString,
  ): Promise<Project | null> {
    const database = loadDatabase();
    const index = database.projects.findIndex(
      (stored) => stored.id === projectId,
    );

    if (index === -1) {
      return null;
    }

    const current = database.projects[index];
    const updated: Project = {
      ...current,
      status: "deleted",
      updatedAt: deletedAt,
    };

    database.projects[index] = updated;
    saveDatabase(database);
    return updated;
  }

  async getById(projectId: string): Promise<Project | null> {
    const database = loadDatabase();
    return database.projects.find((project) => project.id === projectId) ?? null;
  }

  async list(options?: { includeDeleted?: boolean }): Promise<Project[]> {
    const database = loadDatabase();
    const includeDeleted = options?.includeDeleted ?? false;

    if (includeDeleted) {
      return [...database.projects];
    }

    return database.projects.filter((project) => project.status === "active");
  }
}
