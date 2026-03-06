# TestSprite AI Testing Report (MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** time-tracker
- **Date:** 2026-02-27
- **Prepared by:** TestSprite AI Team
- **Test Target:** Frontend UI at `http://localhost:5173`

---

## 2️⃣ Requirement Validation Summary

### Requirement: Task list, filters, and report summary
- **Description:** The app should show the tasks list and report summary cards, and allow filtering by date range and project.

#### Test TC001 View recent tasks list and summary cards on Tarefas page
- **Test Code:** [TC001_View_recent_tasks_list_and_summary_cards_on_Tarefas_page.py](./TC001_View_recent_tasks_list_and_summary_cards_on_Tarefas_page.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/03038b6b-593d-450e-8907-5e4cd8c1a856/5efcb033-5f57-491c-af8d-bf222d821584
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** The main "Tarefas" view rendered without blocking errors and the UI was reachable on first load.
---

#### Test TC002 Filter tasks by valid date range and clear filters
- **Test Code:** [TC002_Filter_tasks_by_valid_date_range_and_clear_filters.py](./TC002_Filter_tasks_by_valid_date_range_and_clear_filters.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/03038b6b-593d-450e-8907-5e4cd8c1a856/28351651-1d5d-44e7-a692-b81a64c32d86
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Applying a valid date range and clearing filters did not break rendering; filter inputs accepted the provided values.
---

#### Test TC003 Filter tasks by project = Todos
- **Test Code:** [TC003_Filter_tasks_by_project__Todos.py](./TC003_Filter_tasks_by_project__Todos.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/03038b6b-593d-450e-8907-5e4cd8c1a856/509eaef3-ec4d-40e4-99b6-8c30a7d7b179
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** The project filter dropdown was reachable and included the "Todos" option without causing UI errors.
---

#### Test TC004 Filter tasks by project = Sem projeto
- **Test Code:** [TC004_Filter_tasks_by_project__Sem_projeto.py](./TC004_Filter_tasks_by_project__Sem_projeto.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/03038b6b-593d-450e-8907-5e4cd8c1a856/85f1db9b-838a-4827-b2a3-7fc26e2a0647
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** The "Sem projeto" filter option was available and selectable; no crash/regression observed.
---

#### Test TC005 Filter tasks by a specific project (when available)
- **Test Code:** [TC005_Filter_tasks_by_a_specific_project_when_available.py](./TC005_Filter_tasks_by_a_specific_project_when_available.py)
- **Test Error:** TEST FAILURE
  - Specific project option not found in project filter dropdown; only 'Todos' and 'Sem projeto' options are available.
  - Cannot select a specific project to verify that the tasks list updates because no specific project option exists.
  - Cannot verify that selecting a specific project keeps summary cards (Horas totais / Tarefas no periodo) visible due to the missing filter option.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/03038b6b-593d-450e-8907-5e4cd8c1a856/0824d904-8748-4221-a5d1-e17ee33d8475
- **Status:** ❌ Failed
- **Severity:** MEDIUM
- **Analysis / Findings:** This failure is consistent with an empty project dataset (no active projects created yet), so the dropdown only shows the static options. The test needs a setup step that creates at least one active project before validating filtering by a specific project.
---

#### Test TC006 Combine date range and project filter together
- **Test Code:** [TC006_Combine_date_range_and_project_filter_together.py](./TC006_Combine_date_range_and_project_filter_together.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/03038b6b-593d-450e-8907-5e4cd8c1a856/c990b8fd-2de0-4c6b-a171-ba9360d3a2c6
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Combining date and project filters did not introduce a rendering failure; inputs remained interactive.
---

#### Test TC007 Delete a task via Excluir and confirm deletion updates summary cards
- **Test Code:** [TC007_Delete_a_task_via_Excluir_and_confirm_deletion_updates_summary_cards.py](./TC007_Delete_a_task_via_Excluir_and_confirm_deletion_updates_summary_cards.py)
- **Test Error:** TEST FAILURE
  - No task entries found: 'Nenhuma tarefa registrada no periodo.' message is displayed
  - Delete button ('Excluir') not present on any task row
  - Cannot open delete confirmation modal because there are no tasks to delete
  - Required summary texts 'Horas totais' and 'Tarefas no periodo' not visible on page
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/03038b6b-593d-450e-8907-5e4cd8c1a856/356df013-8455-426d-a288-5f2efa89c548
- **Status:** ❌ Failed
- **Severity:** HIGH
- **Analysis / Findings:** The deletion flow cannot be validated without at least one task in the list. The test should create a manual task first (or seed localStorage) and then proceed with deletion assertions.
---

#### Test TC008 Cancel task deletion from confirmation modal
- **Test Code:** [TC008_Cancel_task_deletion_from_confirmation_modal.py](./TC008_Cancel_task_deletion_from_confirmation_modal.py)
- **Test Error:** TEST FAILURE
  - No task rows are present on the Tarefas page; the recent tasks list shows the message 'Nenhuma tarefa registrada no periodo.'
  - No 'Excluir' (delete) button is available because there are no task entries to act on.
  - The delete confirmation modal cannot be displayed because the deletion action cannot be initiated.
  - The required behavior (canceling deletion and keeping the task list visible) cannot be validated due to the absence of the deletion flow.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/03038b6b-593d-450e-8907-5e4cd8c1a856/8cdabd21-c4fa-48b1-9bf7-cbe39f611e1a
- **Status:** ❌ Failed
- **Severity:** HIGH
- **Analysis / Findings:** Same root cause as TC007: no tasks to operate on. Add a deterministic precondition (create one task) before testing cancel behavior.
---

#### Test TC009 Invalid date range shows user-facing validation and does not apply filters
- **Test Code:** [TC009_Invalid_date_range_shows_user_facing_validation_and_does_not_apply_filters.py](./TC009_Invalid_date_range_shows_user_facing_validation_and_does_not_apply_filters.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/03038b6b-593d-450e-8907-5e4cd8c1a856/abdb808a-1336-408c-a321-39a071bfaa40
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** The UI exposed a user-facing invalid-range validation message when "De" was later than "Ate", preventing silent acceptance of an invalid range.
---

### Requirement: Create manual task
- **Description:** Users can open the "Nova tarefa" modal, create manual tasks with optional project assignment, and validations block invalid submissions.

#### Test TC010 Create a completed manual task with project and verify list + totals update
- **Test Code:** [TC010_Create_a_completed_manual_task_with_project_and_verify_list__totals_update.py](./TC010_Create_a_completed_manual_task_with_project_and_verify_list__totals_update.py)
- **Test Error:** TEST FAILURE
  - Project option 'Cliente A' not found in project dropdown (available options appear to be: 'Sem projeto', 'Nenhum projeto ativo').
  - Cannot assign the task to the requested optional project because the project is not present in the dropdown.
  - Because the requested project assignment is unavailable, the test cannot continue to fully verify creating a finished task with an optional project and the subsequent updates to the task list and total hours.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/03038b6b-593d-450e-8907-5e4cd8c1a856/e5961c12-e285-4473-a26d-f448ea78c0c7
- **Status:** ❌ Failed
- **Severity:** HIGH
- **Analysis / Findings:** This is a test-data precondition issue (expected a project named "Cliente A" but none exists). The test should create a project in the "Projetos" view first, then create the manual task and select that project.
---

#### Test TC011 Create a completed manual task without selecting a project (Sem projeto)
- **Test Code:** [TC011_Create_a_completed_manual_task_without_selecting_a_project_Sem_projeto.py](./TC011_Create_a_completed_manual_task_without_selecting_a_project_Sem_projeto.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/03038b6b-593d-450e-8907-5e4cd8c1a856/2c185a1f-7ef5-4108-9dbe-37cfd87af5e5
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Manual task creation works when leaving project unset ("Sem projeto"), and the resulting duration formatting validated.
---

#### Test TC012 Validation: cannot save manual task when name is empty
- **Test Code:** [TC012_Validation_cannot_save_manual_task_when_name_is_empty.py](./TC012_Validation_cannot_save_manual_task_when_name_is_empty.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/03038b6b-593d-450e-8907-5e4cd8c1a856/afeb4d22-d91e-4ca4-8096-aac72d10c2b1
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Submitting without a task name correctly triggered required-name validation and prevented saving.
---

#### Test TC013 Validation: cannot save manual task when duration is 0 hours and 0 minutes
- **Test Code:** [TC013_Validation_cannot_save_manual_task_when_duration_is_0_hours_and_0_minutes.py](./TC013_Validation_cannot_save_manual_task_when_duration_is_0_hours_and_0_minutes.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/03038b6b-593d-450e-8907-5e4cd8c1a856/604a47c9-04f6-4fd3-ad84-e571fd55815e
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Zero-duration manual entries were rejected with a user-facing validation message.
---

#### Test TC014 Manual task with minutes only (no hours) saves and formats duration correctly
- **Test Code:** [TC014_Manual_task_with_minutes_only_no_hours_saves_and_formats_duration_correctly.py](./TC014_Manual_task_with_minutes_only_no_hours_saves_and_formats_duration_correctly.py)
- **Test Error:** TEST FAILURE
  - Add/new task button ('+') not found on page
  - 'Nova tarefa' modal could not be opened because no add-task control exists
  - Unable to verify that entering only minutes creates a finished task and displays duration in HH:MM format because the task creation UI was not accessible
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/03038b6b-593d-450e-8907-5e4cd8c1a856/c0d9e89b-f427-4a6f-b6a4-2384493788bf
- **Status:** ❌ Failed
- **Severity:** MEDIUM
- **Analysis / Findings:** The failure indicates the test could not reliably locate the "+" control to open the modal. This is typically improved by adding stable selectors (e.g. `data-testid`) or using role/name based selectors consistently (e.g. `role=button[name='+']`).
---

#### Test TC015 Manual task with hours only (no minutes) saves and formats duration correctly
- **Test Code:** [TC015_Manual_task_with_hours_only_no_minutes_saves_and_formats_duration_correctly.py](./TC015_Manual_task_with_hours_only_no_minutes_saves_and_formats_duration_correctly.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/03038b6b-593d-450e-8907-5e4cd8c1a856/670a9828-f151-46aa-83f6-fc2b0104e78c
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Creating a manual task with hours-only input successfully produced an HH:MM formatted duration.
---

#### Test TC016 Cancel/close modal does not create a task
- **Test Code:** [TC016_Cancelclose_modal_does_not_create_a_task.py](./TC016_Cancelclose_modal_does_not_create_a_task.py)
- **Test Error:** TEST FAILURE
  - ASSERTION: Add ('+') button to open the "Nova tarefa" modal not found on page; interactive elements inspected do not include a control to create a new task.
  - ASSERTION: Unable to open the "Nova tarefa" modal, so it is impossible to verify that closing the modal without saving does not add a task.
  - ASSERTION: No alternative UI element to create a task (e.g., 'Adicionar', 'Nova tarefa') was found on the current page, preventing completion of the test.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/03038b6b-593d-450e-8907-5e4cd8c1a856/0cfa1dc5-69dc-4458-9565-64236b7a28e2
- **Status:** ❌ Failed
- **Severity:** MEDIUM
- **Analysis / Findings:** Similar locator robustness issue as TC014. The cancel/close behavior is testable but needs reliable modal-open detection (stable selectors + explicit navigation to "Tarefas" before searching for the "+" button).
---

### Requirement: Create timer task (start, pause, resume, finalize)
- **Description:** Users can start a timer, pause/resume, and finalize it into a finished task with a non-zero duration.

#### Test TC017 Finalize immediately after start still results in a persisted task
- **Test Code:** [TC017_Finalize_immediately_after_start_still_results_in_a_persisted_task.py](./TC017_Finalize_immediately_after_start_still_results_in_a_persisted_task.py)
- **Test Error:** TEST FAILURE
  - Finalizar button not found on page as an interactive element (no element index present for 'Finalizar' in modal).
  - Clicking element index 317 failed because the element index was not available in the current page state.
  - After clicking 'Salvar tarefa' earlier, the task 'Timer rápido' and the status 'Finalizada' are not present in the task list (search returned no matches).
  - The modal remained open after saving, preventing confirmation that the task was finalized.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/03038b6b-593d-450e-8907-5e4cd8c1a856/589f9f7e-8cd9-4db6-8a9a-82fbabeffa7d
- **Status:** ❌ Failed
- **Severity:** HIGH
- **Analysis / Findings:** The timer finalize path could not be fully driven by the test (missing or unstable locators for "Finalizar" and post-save state checks). This is likely solvable by improving selectors and ensuring the test explicitly switches the modal to "Timer" mode before attempting timer controls.
---

#### Test TC018 Validation: cannot start timer without task name
- **Test Code:** [TC018_Validation_cannot_start_timer_without_task_name.py](./TC018_Validation_cannot_start_timer_without_task_name.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/03038b6b-593d-450e-8907-5e4cd8c1a856/254c688b-d6a2-4309-899d-32ccbcf8c83a
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Attempting to start the timer without a name correctly triggered validation and prevented starting.
---

#### Test TC019 Cancel/close new task modal does not create a task
- **Test Code:** [TC019_Cancelclose_new_task_modal_does_not_create_a_task.py](./TC019_Cancelclose_new_task_modal_does_not_create_a_task.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/03038b6b-593d-450e-8907-5e4cd8c1a856/2bd4ef6b-66f8-42ce-a68e-2f10e8cab3e0
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Closing the modal without saving did not persist a new timer task in the list.
---

### Requirement: Project management (create, rename, remove)
- **Description:** Users can create projects, and the app prevents invalid/duplicate names.

#### Test TC020 Create a new project and verify it is selectable in 'Nova tarefa'
- **Test Code:** [TC020_Create_a_new_project_and_verify_it_is_selectable_in_Nova_tarefa.py](./TC020_Create_a_new_project_and_verify_it_is_selectable_in_Nova_tarefa.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/03038b6b-593d-450e-8907-5e4cd8c1a856/00146cde-61ae-499f-a006-d89cd719a2ea
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Creating a project succeeded and the newly created project became available in the "Nova tarefa" project selector.
---

#### Test TC021 Prevent creating a duplicate project name (case-insensitive)
- **Test Code:** [TC021_Prevent_creating_a_duplicate_project_name_case_insensitive.py](./TC021_Prevent_creating_a_duplicate_project_name_case_insensitive.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/03038b6b-593d-450e-8907-5e4cd8c1a856/f1fae8be-754c-48e6-be3f-ffe2e142e72e
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Duplicate-name validation was enforced even when the second name used different casing.
---

#### Test TC022 Prevent creating a duplicate project name when extra spaces are used (trim validation)
- **Test Code:** [TC022_Prevent_creating_a_duplicate_project_name_when_extra_spaces_are_used_trim_validation.py](./TC022_Prevent_creating_a_duplicate_project_name_when_extra_spaces_are_used_trim_validation.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/03038b6b-593d-450e-8907-5e4cd8c1a856/470c6d1c-8c1a-4a7a-96cb-354c89f15257
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Project names are normalized (trimmed) for uniqueness; duplicates with leading/trailing spaces were rejected.
---

#### Test TC023 Require project name when creating a new project
- **Test Code:** [TC023_Require_project_name_when_creating_a_new_project.py](./TC023_Require_project_name_when_creating_a_new_project.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/03038b6b-593d-450e-8907-5e4cd8c1a856/6d6377f6-5d38-4d09-b831-67d96585fb15
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Creating a project with an empty name was blocked with a required-field error.
---

## 3️⃣ Coverage & Matching Metrics

- **Overall pass rate:** **69.57%** (16/23 tests passed)

| Requirement | Total Tests | ✅ Passed | ❌ Failed |
|------------|-------------:|----------:|----------:|
| Task list, filters, and report summary | 9 | 6 | 3 |
| Create manual task | 7 | 4 | 3 |
| Create timer task (start, pause, resume, finalize) | 3 | 2 | 1 |
| Project management (create, rename, remove) | 4 | 4 | 0 |

---

## 4️⃣ Key Gaps / Risks

1) **Missing deterministic test data / setup**
- Several failed tests depend on pre-existing projects/tasks (e.g., delete flows, filtering by a specific project).
- Recommendation: add explicit setup steps (create required project/task via UI) or seed `localStorage` (key: `time-tracker-db`) at test start.

2) **Locator robustness / UI discoverability for automation**
- Failures TC014/TC016/TC017 indicate the runner could not reliably find key controls ("+", "Finalizar") in some runs.
- Recommendation: add stable selectors (`data-testid`) to critical controls and prefer role/name selectors in tests.

3) **Timer finalization flow needs stronger automated coverage**
- TC017 suggests the finalize-and-persist behavior is not reliably validated end-to-end.
- Recommendation: add a single deterministic timer test that explicitly switches to Timer mode, starts, waits \(>= 2s\), finalizes, and asserts the task appears with a non-zero HH:MM duration.

4) **Environment stability**
- For larger suites, prefer running the app in a production-like mode (`vite build` + `vite preview`) to reduce dev-server flakiness and timing issues.

