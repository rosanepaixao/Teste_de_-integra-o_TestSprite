import type { Task } from "../entities/task";

export function assertValidTask(task: Task): void {
  const name = task.name?.trim();

  if (!name) {
    throw new Error("Nome da tarefa é obrigatório.");
  }

  if (task.mode === "manual") {
    if (!task.loggedAt) {
      throw new Error("Tarefas manuais precisam de loggedAt.");
    }

    if (task.durationSeconds <= 0) {
      throw new Error("Duração deve ser maior que zero para tarefas manuais.");
    }
  }

  if (task.mode === "timer" && !task.startAt) {
    throw new Error("Tarefas com timer precisam de startAt.");
  }
}
