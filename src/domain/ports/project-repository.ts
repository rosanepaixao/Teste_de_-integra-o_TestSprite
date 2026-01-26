import type { Project } from "../entities/project";
import type { IsoDateString } from "../entities/types";

export interface ProjectRepository {
  create(project: Project): Promise<Project>;
  update(project: Project): Promise<Project>;
  softDelete(projectId: string, deletedAt: IsoDateString): Promise<Project | null>;
  getById(projectId: string): Promise<Project | null>;
  list(options?: { includeDeleted?: boolean }): Promise<Project[]>;
}
