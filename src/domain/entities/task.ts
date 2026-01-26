import type { IsoDateString, TaskMode, TaskStatus } from "./types";

/**
 * Represents a work task tracked in the system.
 *
 * Invariants:
 * - durationSeconds must be > 0 for finished/manual tasks
 * - status must be a valid TaskStatus
 * - projectId is optional (null means "Sem projeto")
 * - manual tasks use loggedAt as their reference date
 * - timer tasks use startAt as their reference date
 */
export interface Task {
  id: string;
  name: string;
  projectId?: string | null;
  mode: TaskMode;
  status: TaskStatus;
  /**
   * Total duration in seconds (RN-01).
   * Must be > 0 once the task is finished (RN-02).
   */
  durationSeconds: number;
  /** Timestamp when the timer started (timer mode). */
  startAt?: IsoDateString | null;
  /** Timestamp when the timer was finished. */
  endAt?: IsoDateString | null;
  /** Timestamp used for manual entries (manual mode). */
  loggedAt?: IsoDateString | null;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}
