import { useEffect, useState } from "react";
import { useTaskFormStore } from "../../task-form/store/task-form-store";

export function ProjectsPage() {
  const { projects, projectError, createProject, renameProject, deleteProject, refreshProjects } =
    useTaskFormStore();
  const activeProjects = projects.filter((project) => project.status === "active");
  const [renameTarget, setRenameTarget] = useState<{ id: string; name: string } | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    void refreshProjects();
  }, [refreshProjects]);

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Projetos</h1>
          <p>Gerencie seus projetos ativos e removidos.</p>
        </div>
      </header>

      <section className="project-manager" aria-labelledby="projectManagerTitle">
        <header className="section-header">
          <h2 id="projectManagerTitle">Lista de projetos</h2>
          <p>Crie, renomeie ou remova projetos para organizar suas tarefas.</p>
        </header>

        <form
          className="project-form"
          onSubmit={(event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const input = form.querySelector<HTMLInputElement>("input[name='projectInput']");
            if (input) {
              void createProject(input.value);
              input.value = "";
            }
          }}
          noValidate
        >
          <div className="field">
            <label htmlFor="projectInput">Novo projeto</label>
            <input id="projectInput" name="projectInput" type="text" placeholder="Ex.: Cliente Alfa" />
            <span className={`field__message ${projectError ? "is-visible" : ""}`}>
              {projectError}
            </span>
          </div>
          <button className="button button--primary" type="submit">
            Adicionar projeto
          </button>
        </form>

        <ul className="project-list" aria-live="polite">
          {activeProjects.length === 0 ? (
            <li className="project-list__empty">Nenhum projeto cadastrado ainda.</li>
          ) : (
            activeProjects.map((project) => (
              <li className="project-list__item" key={project.id}>
                <div className="project-list__name">{project.name}</div>
                <div className="project-actions">
                  <button
                    type="button"
                    className="button"
                    onClick={() => {
                      setRenameTarget({ id: project.id, name: project.name });
                      setRenameValue(project.name);
                    }}
                  >
                    Renomear
                  </button>
                  <button
                    type="button"
                    className="button button--ghost"
                    onClick={() => setDeleteTarget({ id: project.id, name: project.name })}
                  >
                    Remover
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </section>

      {renameTarget ? (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="renameProjectTitle">
          <div className="modal__overlay" onClick={() => setRenameTarget(null)} />
          <div className="modal__content">
            <header className="modal__header">
              <div>
                <h2 id="renameProjectTitle">Renomear projeto</h2>
                <p>Atualize o nome para facilitar a identificacao nas tarefas.</p>
              </div>
              <button type="button" className="button button--ghost" onClick={() => setRenameTarget(null)}>
                Fechar
              </button>
            </header>

            <form
              className="project-form"
              onSubmit={(event) => {
                event.preventDefault();
                void renameProject(renameTarget.id, renameValue);
                setRenameTarget(null);
              }}
              noValidate
            >
              <div className="field">
                <label htmlFor="renameProjectInput">Novo nome do projeto</label>
                <input
                  id="renameProjectInput"
                  name="renameProjectInput"
                  type="text"
                  value={renameValue}
                  onChange={(event) => setRenameValue(event.target.value)}
                />
                <span className={`field__message ${projectError ? "is-visible" : ""}`}>{projectError}</span>
              </div>
              <div className="project-actions">
                <button className="button button--primary" type="submit">
                  Salvar
                </button>
                <button type="button" className="button button--ghost" onClick={() => setRenameTarget(null)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="deleteProjectTitle">
          <div className="modal__overlay" onClick={() => setDeleteTarget(null)} />
          <div className="modal__content">
            <header className="modal__header">
              <div>
                <h2 id="deleteProjectTitle">Remover projeto</h2>
                <p>
                  Deseja remover o projeto "{deleteTarget.name}"? Ele nao aparecera em novas tarefas.
                </p>
              </div>
            </header>
            <div className="project-actions">
              <button
                type="button"
                className="button button--primary"
                onClick={() => {
                  void deleteProject(deleteTarget.id);
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
