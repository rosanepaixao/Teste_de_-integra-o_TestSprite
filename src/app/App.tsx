import { useState } from "react";
import { TaskFormPage } from "../features/task-form/pages/TaskFormPage";
import { ProjectsPage } from "../features/projects/pages/ProjectsPage";

export function App() {
  const [activePage, setActivePage] = useState<"tasks" | "projects">("tasks");

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar__brand">Time Tracker</div>
        <nav className="sidebar__nav">
          <button
            type="button"
            className={`sidebar__link ${activePage === "tasks" ? "is-active" : ""}`}
            onClick={() => setActivePage("tasks")}
          >
            Minhas Tarefas
          </button>
          <button
            type="button"
            className={`sidebar__link ${activePage === "projects" ? "is-active" : ""}`}
            onClick={() => setActivePage("projects")}
          >
            Projetos
          </button>
        </nav>
      </aside>
      <main className="main-content">
        {activePage === "tasks" ? <TaskFormPage /> : <ProjectsPage />}
      </main>
    </div>
  );
}
