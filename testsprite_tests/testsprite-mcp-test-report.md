# TestSprite AI Testing Report (MCP)

---

## 1️⃣ Document Metadata

- **Project Name:** time-tracker
- **Date:** 2026-05-21
- **Prepared by:** TestSprite AI Team (executed via Cursor agent)
- **Environment:** Vite production preview at `http://127.0.0.1:5173/`
- **Test plan:** 22 frontend cases in `testsprite_tests/testsprite_frontend_test_plan.json`

---

## 2️⃣ Requirement Validation Summary

### Requirement: Task creation (manual and timer)

- **Description:** Users can open “Nova tarefa”, register manual duration or use start/pause/stop timer, and see tasks in history.

#### Test TC001 Save a manual task and see it in history

- **Test Code:** [TC001_Save_a_manual_task_and_see_it_in_history.py](./TC001_Save_a_manual_task_and_see_it_in_history.py)
- **Status:** BLOCKED
- **Severity:** HIGH
- **Analysis / Findings:** The floating “+” control is visible but has no accessible name (`aria-label` / visible text). TestSprite’s agent could not target it in the interactive element list, so the modal never opened.

#### Test TC002 Log a manual task and see it counted in the summary

- **Status:** BLOCKED — same root cause as TC001.

#### Test TC003 Start, pause, resume, and stop a timer task

- **Status:** BLOCKED — timer flow unreachable without opening the new-task modal.

#### Test TC004 Create a timer task and finish it from the running state

- **Status:** BLOCKED — same as TC003.

#### Test TC005 Delete a task from history

- **Status:** BLOCKED — no seed task could be created from the Tasks page.

#### Test TC006 Save a manual task with a project

- **Status:** PASSED
- **Severity:** LOW
- **Analysis / Findings:** Manual task with project assignment works when the create flow is reached (likely via cross-test state or alternate navigation path).

#### Test TC012 Assign a project to a new task and keep it in history

- **Status:** PASSED

---

### Requirement: Filters and reports

- **Description:** Filter tasks by date and project; show summary cards for the period.

#### Test TC008 Filter task history by project and date range

- **Status:** PASSED

#### Test TC010 View tasks with no project using the project filter

- **Status:** PASSED

#### Test TC011 Show only unassigned tasks with the Sem projeto filter

- **Status:** BLOCKED — no tasks in period to validate filter behavior.

#### Test TC013 Clear task filters and restore the full history

- **Status:** PASSED

#### Test TC022 Handle the empty task history state

- **Status:** PASSED
- **Analysis / Findings:** Empty state copy (“Nenhuma tarefa registrada no periodo.”) renders correctly.

---

### Requirement: Project management

- **Description:** Create, rename, and soft-delete projects; reflect names on tasks.

#### Test TC007 Create a project and use it on a new task

- **Status:** PASSED

#### Test TC009 Create a project and see it available for task assignment

- **Status:** PASSED

#### Test TC015 Rename a project and see the updated name reflected

- **Status:** PASSED

#### Test TC016 Rename a project and keep historical tasks linked

- **Status:** BLOCKED — could not create prerequisite task from Tasks page.

#### Test TC020 Soft-delete a project without losing historical task labels

- **Status:** FAILED
- **Severity:** MEDIUM
- **Analysis / Findings:** After “Remover”, the project still appeared in the active project filter dropdown. Historical task labels remained (expected), but removed projects should not appear for new-task/filter selection.

#### Test TC021 Soft-delete a project while keeping historical task associations

- **Status:** FAILED
- **Severity:** MEDIUM
- **Analysis / Findings:** “Remover” did not remove the project from the active list; possible missing confirmation step handling or stale filter options in the store.

---

### Requirement: Validation and timer UI states

#### Test TC017–TC019 Manual validation (name / duration)

- **Status:** BLOCKED — modal not reachable via automation.

#### Test TC014 Show running and paused timer states

- **Status:** BLOCKED — timer UI not reachable.

---

## 3️⃣ Coverage & Matching Metrics

- **40.91%** of tests passed (9 / 22)

| Requirement              | Total Tests | Passed | Failed | Blocked |
|--------------------------|-------------|--------|--------|---------|
| Task creation            | 8           | 2      | 0      | 6       |
| Filters and reports      | 5           | 4      | 0      | 1       |
| Project management       | 6           | 3      | 2      | 1       |
| Validation / timer state | 3           | 0      | 0      | 3       |

**Dashboard:** [TestSprite MCP test run](https://www.testsprite.com/dashboard/mcp/tests/d3fb4eea-165b-4c87-b995-9c0a0589c4c2)

---

## 4️⃣ Key Gaps / Risks

1. **Accessibility on “Nova tarefa” button (HIGH):** The header `+` button in `TaskFormPage.tsx` only shows “+” with class `button--icon` and no `aria-label`. This blocked 11 tests that depend on opening the task modal. Add e.g. `aria-label="Nova tarefa"` and visible text for screen readers and automation.

2. **Soft-delete UX (MEDIUM):** TC020–TC021 indicate deleted projects may still appear in filter/task dropdowns. Verify `deleteProject` updates filter option lists and that the confirmation modal is completed in automated flows.

3. **Test data / date filters (LOW):** Several blocked cases ran against an empty period. Consider defaulting filters to “all time” or seeding tasks with `loggedAt` within the default range for E2E runs.

4. **MCP environment (setup):** Cursor could not start TestSprite until `npx` was on PATH. `C:\Users\rosan\.cursor\mcp.json` was updated to use `C:\Program Files\nodejs\npx.cmd`. Reload MCP in **Cursor Settings → MCP** after changes.

---

**Artifacts:** `testsprite_tests/tmp/raw_report.md`, `testsprite_tests/tmp/test_results.json`, generated Playwright scripts `TC001`–`TC022`.
