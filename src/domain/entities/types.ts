/**
 * ISO 8601 timestamp string in UTC, e.g. "2024-05-01T12:34:56.789Z".
 * Domain entities should serialize dates using this format.
 */
export type IsoDateString = string;

/**
 * Project lifecycle status.
 * - active: available for selection in new tasks
 * - deleted: soft-deleted, retained for historical reporting
 */
export type ProjectStatus = "active" | "deleted";

/**
 * Task tracking mode.
 * - manual: duration entered by the user
 * - timer: duration computed from timer intervals
 */
export type TaskMode = "manual" | "timer";

/**
 * Task execution status.
 * - running: timer is currently active
 * - paused: timer is stopped but task is not finished
 * - finished: task is finalized and duration is immutable
 */
export type TaskStatus = "running" | "paused" | "finished";
