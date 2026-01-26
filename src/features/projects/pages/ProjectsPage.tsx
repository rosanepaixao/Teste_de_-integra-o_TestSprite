import { useEffect } from "react";
import { useTaskFormStore } from "../../task-form/store/task-form-store";

export function ProjectsPage() {
  const { projects, projectError, createProject, renameProject, deleteProject, refreshProjects } =
    useTaskFormStore();

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
          {projects.length === 0 ? (
            <li className="project-list__empty">Nenhum projeto cadastrado ainda.</li>
          ) : (
            projects.map((project) => (
              <li className="project-list__item" key={project.id}>
                <div className="project-list__name">{project.name}</div>
                {project.status === "deleted" ? (
                  <span className="project-status project-status--deleted">Removido</span>
                ) : null}
                <div className="project-actions">
                  <button
                    type="button"
                    className="button"
                    disabled={project.status === "deleted"}
                    onClick={() => {
                      const next = window.prompt("Novo nome do projeto:", project.name);
                      if (next !== null) {
                        void renameProject(project.id, next);
                      }
                    }}
                  >
                    Renomear
                  </button>
                  <button
                    type="button"
                    className="button button--ghost"
                    disabled={project.status === "deleted"}
                    onClick={() => {
                      if (
                        window.confirm(
                          `Deseja remover o projeto "${project.name}"? Ele nao aparecera em novas tarefas.`,
                        )
                      ) {
                        void deleteProject(project.id);
                      }
                    }}
                  >
                    Remover
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </section>
    </>
  );
}
