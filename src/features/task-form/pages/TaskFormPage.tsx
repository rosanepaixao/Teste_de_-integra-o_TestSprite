import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useTaskFormStore, getProjectName } from "../store/task-form-store";
import { secondsToClock, secondsToHoursMinutes, formatDateLabel } from "../../../shared/utils/time";

export function TaskFormPage() {
  const {
    taskName,
    projectId,
    filterProjectId,
    filterStartDate,
    filterEndDate,
    isTaskFormOpen,
    mode,
    hours,
    minutes,
    taskNameError,
    durationError,
    projects,
    tasks,
    taskListState,
    reportState,
    reportSummary,
    timerStatus,
    elapsedSeconds,
    toast,
    initialize,
    openTaskForm,
    closeTaskForm,
    setTaskName,
    setProjectId,
    setFilterProjectId,
    setFilterStartDate,
    setFilterEndDate,
    clearFilters,
    setMode,
    setHours,
    setMinutes,
    submitManualTask,
    startTimer,
    pauseTimer,
    stopTimer,
    tickTimer,
    deleteTask,
    clearToast,
    refreshTasks,
    refreshReport,
  } = useTaskFormStore();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    void refreshTasks();
    void refreshReport();
  }, [filterProjectId, filterStartDate, filterEndDate, refreshTasks, refreshReport]);

  useEffect(() => {
    if (timerStatus !== "running") {
      return;
    }

    const interval = window.setInterval(() => {
      tickTimer();
    }, 1000);

    return () => window.clearInterval(interval);
  }, [timerStatus, tickTimer]);

  useEffect(() => {
    if (!toast.visible) {
      return;
    }

    const timeout = window.setTimeout(() => {
      clearToast();
    }, 2800);

    return () => window.clearTimeout(timeout);
  }, [toast.visible, clearToast]);

  const activeProjects = projects.filter((project) => project.status === "active");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === "manual") {
      void submitManualTask();
      return;
    }

    if (timerStatus !== "stopped") {
      return;
    }

    void startTimer();
  };

  return (
    <>
      <div className={`toast ${toast.visible ? "is-visible" : ""}`} data-tone={toast.tone}>
        <span>{toast.message}</span>
      </div>

      <header className="page-header">
        <div>
          <h1>Tarefas</h1>
          <p>Resumo das tarefas recentes e horas totais.</p>
        </div>
        <button type="button" className="button button--primary button--icon" onClick={openTaskForm}>
          +
        </button>
      </header>

      <section className="filters">
        <div className="field">
          <label htmlFor="startDate">De</label>
          <input
            id="startDate"
            type="date"
            value={filterStartDate}
            onChange={(event) => setFilterStartDate(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="endDate">Ate</label>
          <input
            id="endDate"
            type="date"
            value={filterEndDate}
            onChange={(event) => setFilterEndDate(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="filterProject">Projeto</label>
          <select
            id="filterProject"
            value={filterProjectId}
            onChange={(event) => setFilterProjectId(event.target.value)}
          >
            <option value="">Todos</option>
            <option value="none">Sem projeto</option>
            {activeProjects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <button type="button" className="button button--ghost" onClick={clearFilters}>
          Limpar filtros
        </button>
      </section>

      <section className="task-history" aria-labelledby="taskHistoryTitle">
        <header className="section-header">
          <h2 id="taskHistoryTitle">Tarefas</h2>
          <p>Acompanhe as tarefas registradas no periodo.</p>
        </header>
        <div className={`state-panel ${taskListState ? "is-visible" : ""}`}>
          {taskListState === "loading"
            ? "Carregando tarefas..."
            : taskListState === "empty"
            ? "Nenhuma tarefa registrada no periodo."
            : ""}
        </div>
        <ul className="task-list" aria-live="polite">
          {tasks.map((task) => (
            <li className="task-list__item" key={task.id}>
              <div>
                <div className="task-list__name">{task.name}</div>
                <div className="task-list__meta">
                  {getProjectName(projects, task.projectId)} · {formatDateLabel(task.loggedAt ?? task.startAt ?? task.createdAt)}
                </div>
              </div>
              <div className="task-list__right">
                <span className="task-list__duration">
                  {task.durationSeconds > 0 ? secondsToHoursMinutes(task.durationSeconds) : "00:00"}
                </span>
                <button
                  type="button"
                  className="button button--danger button--compact"
                  onClick={() => setDeleteTarget({ id: task.id, name: task.name })}
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="report-summary" aria-labelledby="reportSummaryTitle">
        <header className="section-header">
          <h2 id="reportSummaryTitle">Relatorios</h2>
          <p>Resumo de horas e tarefas no periodo selecionado.</p>
        </header>
        <div className={`state-panel ${reportState ? "is-visible" : ""}`}>
          {reportState === "loading"
            ? "Carregando relatorios..."
            : reportState === "empty"
            ? "Sem dados para gerar relatorios."
            : ""}
        </div>
        <div className="report-cards">
          {reportSummary ? (
            [
              { label: "Horas totais", value: reportSummary.totalHours },
              { label: "Tarefas no periodo", value: reportSummary.totalTasks },
            ].map((card) => (
              <div className="report-card" key={card.label}>
                <span className="report-card__label">{card.label}</span>
                <span className="report-card__value">{card.value}</span>
              </div>
            ))
          ) : null}
        </div>
      </section>

      {isTaskFormOpen ? (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal__overlay" onClick={closeTaskForm} />
          <div className="modal__content">
            <header className="modal__header">
              <div>
                <h2>Nova tarefa</h2>
                <p>Registre tempo manualmente ou via timer.</p>
              </div>
              <button type="button" className="button button--ghost" onClick={closeTaskForm}>
                Fechar
              </button>
            </header>

            <form className="task-form" onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label htmlFor="taskName">Nome da tarefa</label>
                <input
                  id="taskName"
                  name="taskName"
                  type="text"
                  placeholder="Ex.: Reuniao com cliente"
                  required
                  value={taskName}
                  onChange={(event) => setTaskName(event.target.value)}
                  className={taskNameError ? "is-invalid" : ""}
                />
                <span className={`field__message ${taskNameError ? "is-visible" : ""}`}>
                  {taskNameError}
                </span>
              </div>

              <div className="field">
                <label htmlFor="projectSelect">Projeto (opcional)</label>
                <select
                  id="projectSelect"
                  name="projectId"
                  value={projectId}
                  onChange={(event) => setProjectId(event.target.value)}
                >
                  <option value="">Sem projeto</option>
                  {activeProjects.length === 0 ? (
                    <option value="" disabled>
                      Nenhum projeto ativo
                    </option>
                  ) : (
                    activeProjects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="field">
                <span className="label">Modo de registro</span>
                <div className="toggle">
                  <label className="toggle__option">
                    <input
                      type="radio"
                      name="mode"
                      value="manual"
                      checked={mode === "manual"}
                      onChange={() => setMode("manual")}
                    />
                    Manual
                  </label>
                  <label className="toggle__option">
                    <input
                      type="radio"
                      name="mode"
                      value="timer"
                      checked={mode === "timer"}
                      onChange={() => setMode("timer")}
                    />
                    Timer
                  </label>
                </div>
              </div>

              <div className={`mode mode--manual ${mode === "timer" ? "is-hidden" : ""}`}>
                <div className="field">
                  <label htmlFor="hours">Horas</label>
                  <input
                    id="hours"
                    name="hours"
                    type="number"
                    min={0}
                    max={999}
                    placeholder="0"
                    value={hours}
                    onChange={(event) => setHours(event.target.value)}
                    className={durationError ? "is-invalid" : ""}
                  />
                </div>
                <div className="field">
                  <label htmlFor="minutes">Minutos</label>
                  <input
                    id="minutes"
                    name="minutes"
                    type="number"
                    min={0}
                    max={59}
                    placeholder="0"
                    value={minutes}
                    onChange={(event) => setMinutes(event.target.value)}
                    className={durationError ? "is-invalid" : ""}
                  />
                  <span className={`field__message ${durationError ? "is-visible" : ""}`}>
                    {durationError}
                  </span>
                </div>
              </div>

              <div className={`mode mode--timer ${mode === "manual" ? "is-hidden" : ""}`}>
                <div className="timer-status" role="status" aria-live="polite">
                  <span className="timer-status__label">Status:</span>
                  <span className="timer-status__value" data-status={timerStatus}>
                    {timerStatus === "running"
                      ? "Em andamento"
                      : timerStatus === "paused"
                      ? "Pausado"
                      : "Parado"}
                  </span>
                  <span className="timer-status__time">{secondsToClock(elapsedSeconds)}</span>
                </div>
                <div className="timer-controls">
                  <button
                    type="button"
                    className="button"
                    onClick={() => void startTimer()}
                    disabled={timerStatus === "running"}
                  >
                    {timerStatus === "paused" ? "Retomar" : "Iniciar"}
                  </button>
                  <button
                    type="button"
                    className="button"
                    onClick={() => void pauseTimer()}
                    disabled={timerStatus !== "running"}
                  >
                    Pausar
                  </button>
                  <button
                    type="button"
                    className="button button--ghost"
                    onClick={() => void stopTimer()}
                    disabled={timerStatus === "stopped"}
                  >
                    Finalizar
                  </button>
                </div>
              </div>

              <footer className="form-footer">
                <button className="button button--primary" type="submit">
                  Salvar tarefa
                </button>
              </footer>
            </form>
          </div>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="deleteTaskTitle">
          <div className="modal__overlay" onClick={() => setDeleteTarget(null)} />
          <div className="modal__content">
            <header className="modal__header">
              <div>
                <h2 id="deleteTaskTitle">Excluir tarefa</h2>
                <p>Deseja excluir a tarefa "{deleteTarget.name}"? Essa acao nao pode ser desfeita.</p>
              </div>
            </header>
            <div className="project-actions">
              <button
                type="button"
                className="button button--primary"
                onClick={() => {
                  void deleteTask(deleteTarget.id);
                  setDeleteTarget(null);
                }}
              >
                Confirmar
              </button>
              <button type="button" className="button button--ghost" onClick={() => setDeleteTarget(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
