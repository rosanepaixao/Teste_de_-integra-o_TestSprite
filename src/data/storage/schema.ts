import type { Project } from "../../domain/entities/project";
import type { Task } from "../../domain/entities/task";
import type { TimerInterval } from "../../domain/entities/timer-interval";

export type SchemaVersion = 1;

export interface DatabaseSchemaV1 {
  schemaVersion: 1;
  projects: Project[];
  tasks: Task[];
  timerIntervals: TimerInterval[];
}

export type DatabaseSchema = DatabaseSchemaV1;

export const CURRENT_SCHEMA_VERSION: SchemaVersion = 1;
