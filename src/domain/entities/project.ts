import type { IsoDateString, ProjectStatus } from "./types";

/**
 * Represents a project grouping tasks.
 *
 * Invariants:
 * - name must be non-empty
 * - status must be a valid ProjectStatus
 */
export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}
