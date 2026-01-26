import type { IsoDateString } from "./types";

/**
 * Represents a running interval within a timer-based task.
 *
 * Invariants:
 * - startedAt must be earlier than stoppedAt when stoppedAt is present
 */
export interface TimerInterval {
  taskId: string;
  startedAt: IsoDateString;
  stoppedAt?: IsoDateString | null;
}
