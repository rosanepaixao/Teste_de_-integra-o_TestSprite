
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** time-tracker
- **Date:** 2026-05-21
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001 Save a manual task and see it in history
- **Test Code:** [TC001_Save_a_manual_task_and_see_it_in_history.py](./TC001_Save_a_manual_task_and_see_it_in_history.py)
- **Test Error:** TEST BLOCKED

The test could not be run — no way to open the new-task dialog from the UI was available.

Observations:
- The page shows 'Nenhuma tarefa registrada no periodo.' and a floating add icon is visible in the screenshot, but no corresponding interactive element for adding a task was present in the page's interactive elements list.
- The interactive elements inspected (indices 3, 8, 10, 11, 12, 13) do not include any control to create or submit a new task.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/d3fb4eea-165b-4c87-b995-9c0a0589c4c2/451a7c2e-2ced-406b-9856-21fcd5763e4e
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002 Log a manual task and see it counted in the summary
- **Test Code:** [TC002_Log_a_manual_task_and_see_it_counted_in_the_summary.py](./TC002_Log_a_manual_task_and_see_it_counted_in_the_summary.py)
- **Test Error:** TEST BLOCKED

The test could not be run — the UI provides no visible control to create a new task.

Observations:
- The Tasks page is visible and shows "Nenhuma tarefa registrada no periodo." but no Add/New/+ button is present.
- The page interactive elements list contains date filters, project filter, and a "Limpar filtros" button but no create-task control.

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/d3fb4eea-165b-4c87-b995-9c0a0589c4c2/2be4328d-0109-4126-8f44-8f367a130757
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003 Start, pause, resume, and stop a timer task
- **Test Code:** [TC003_Start_pause_resume_and_stop_a_timer_task.py](./TC003_Start_pause_resume_and_stop_a_timer_task.py)
- **Test Error:** TEST BLOCKED

The test could not be run — the UI provides no accessible way to open the new-task (timer) dialog required to perform the pause/resume/stop workflow.

Observations:
- The page DOM exposes only filter and navigation controls (date inputs, project select, 'Limpar filtros') and no interactive element for the floating '+' add button shown in the screenshot.
- Clicking available buttons (element index 3) only reselected the 'Tarefas' view and did not open any dialog or form to create a task.
- Without a way to create/start a timer task through the visible interactive elements, the pause/resume/stop scenario cannot be executed.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/d3fb4eea-165b-4c87-b995-9c0a0589c4c2/787e0adb-b99a-4e86-a7cb-d8ad9c8434e4
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004 Create a timer task and finish it from the running state
- **Test Code:** [TC004_Create_a_timer_task_and_finish_it_from_the_running_state.py](./TC004_Create_a_timer_task_and_finish_it_from_the_running_state.py)
- **Test Error:** TEST BLOCKED

The test could not be run — no accessible control exists to create or start a timer task on the Time Tracker page.

Observations:
- The page loaded and shows the tasks view, but no 'create task' or 'start timer' button is available as an interactive element.
- The UI indicates "Nenhuma tarefa registrada no periodo." and there is no visible way to add a timed task from the available interactive elements.

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/d3fb4eea-165b-4c87-b995-9c0a0589c4c2/6c40d669-e44c-4c17-ad6b-076aa5319bd5
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005 Delete a task from history
- **Test Code:** [TC005_Delete_a_task_from_history.py](./TC005_Delete_a_task_from_history.py)
- **Test Error:** TEST BLOCKED

The test could not be run — the UI provides no way to create or select a task to delete.

Observations:
- The tasks list displays 'Nenhuma tarefa registrada no periodo.' (no tasks in the period).
- No button or control to add a new task was present among the page's interactive elements.
- Only filter controls (date inputs and project select) and filter/section buttons are available; no task entries or delete controls were visible.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/d3fb4eea-165b-4c87-b995-9c0a0589c4c2/2bdce819-0021-4b5b-9e8a-fc477406367e
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006 Save a manual task with a project
- **Test Code:** [TC006_Save_a_manual_task_with_a_project.py](./TC006_Save_a_manual_task_with_a_project.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/d3fb4eea-165b-4c87-b995-9c0a0589c4c2/c7391fb7-fb86-41b0-9e1a-4c1a8c755551
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007 Create a project and use it on a new task
- **Test Code:** [TC007_Create_a_project_and_use_it_on_a_new_task.py](./TC007_Create_a_project_and_use_it_on_a_new_task.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/d3fb4eea-165b-4c87-b995-9c0a0589c4c2/02752bf0-bf47-4544-ac1e-e643894501c7
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008 Filter task history by project and date range
- **Test Code:** [TC008_Filter_task_history_by_project_and_date_range.py](./TC008_Filter_task_history_by_project_and_date_range.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/d3fb4eea-165b-4c87-b995-9c0a0589c4c2/ebc56c73-92f8-4458-8566-eb81fc3ebca9
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009 Create a project and see it available for task assignment
- **Test Code:** [TC009_Create_a_project_and_see_it_available_for_task_assignment.py](./TC009_Create_a_project_and_see_it_available_for_task_assignment.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/d3fb4eea-165b-4c87-b995-9c0a0589c4c2/f0ea5542-cbd6-489b-906f-67afa54893ed
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010 View tasks with no project using the project filter
- **Test Code:** [TC010_View_tasks_with_no_project_using_the_project_filter.py](./TC010_View_tasks_with_no_project_using_the_project_filter.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/d3fb4eea-165b-4c87-b995-9c0a0589c4c2/37c4062b-7b49-440e-bb31-a8121490ac35
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC011 Show only unassigned tasks with the Sem projeto filter
- **Test Code:** [TC011_Show_only_unassigned_tasks_with_the_Sem_projeto_filter.py](./TC011_Show_only_unassigned_tasks_with_the_Sem_projeto_filter.py)
- **Test Error:** TEST BLOCKED

The test could not be run — there are no tasks available to verify the 'Sem projeto' filter, and the UI provides no visible control to create tasks.

Observations:
- The page displays 'Nenhuma tarefa registrada no periodo.'
- No 'add task' or similar control was found on the page to create test data
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/d3fb4eea-165b-4c87-b995-9c0a0589c4c2/55c9685c-4b65-4e5d-8905-0fa2554590f1
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC012 Assign a project to a new task and keep it in history
- **Test Code:** [TC012_Assign_a_project_to_a_new_task_and_keep_it_in_history.py](./TC012_Assign_a_project_to_a_new_task_and_keep_it_in_history.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/d3fb4eea-165b-4c87-b995-9c0a0589c4c2/a7cfce69-2305-4272-bb4b-a9d56f8db9d1
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC013 Clear task filters and restore the full history
- **Test Code:** [TC013_Clear_task_filters_and_restore_the_full_history.py](./TC013_Clear_task_filters_and_restore_the_full_history.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/d3fb4eea-165b-4c87-b995-9c0a0589c4c2/52ae1ab4-5069-40b3-ba44-686df9b0d29f
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC014 Show running and paused timer states
- **Test Code:** [TC014_Show_running_and_paused_timer_states.py](./TC014_Show_running_and_paused_timer_states.py)
- **Test Error:** TEST BLOCKED

The test could not be run — the UI provides no way to create a new task so the timer functionality cannot be exercised.

Observations:
- No interactive 'add task' or 'new task' button/control is present in the page's interactive element list.
- The page shows "Nenhuma tarefa registrada no periodo." and a floating "+" is visible in the screenshot, but that control is not listed as an interactive element and cannot be activated by the test.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/d3fb4eea-165b-4c87-b995-9c0a0589c4c2/f2f950d0-150e-4dc6-b310-1f49682e5ddb
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC015 Rename a project and see the updated name reflected
- **Test Code:** [TC015_Rename_a_project_and_see_the_updated_name_reflected.py](./TC015_Rename_a_project_and_see_the_updated_name_reflected.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/d3fb4eea-165b-4c87-b995-9c0a0589c4c2/2e9b9648-47cf-472b-8ccf-fb29f0ba76e8
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC016 Rename a project and keep historical tasks linked
- **Test Code:** [TC016_Rename_a_project_and_keep_historical_tasks_linked.py](./TC016_Rename_a_project_and_keep_historical_tasks_linked.py)
- **Test Error:** TEST BLOCKED

A task could not be created — the Tasks view provides no visible control to add a new task, so the historical-association part of the test cannot be completed.

Observations:
- The Tasks page only shows date filters, a project dropdown, and a "Limpar filtros" button; no "Adicionar tarefa" or visible add (+) control is present among the interactive elements.
- The interactive elements list contains only filters (date inputs and project select) and no add-task button, so a prerequisite task cannot be created through the UI.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/d3fb4eea-165b-4c87-b995-9c0a0589c4c2/c4d458b1-e0b1-4b2f-8ffd-3789c4989d06
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC017 Show validation when manual task name is missing
- **Test Code:** [TC017_Show_validation_when_manual_task_name_is_missing.py](./TC017_Show_validation_when_manual_task_name_is_missing.py)
- **Test Error:** TEST BLOCKED

The test could not be run — the UI provides no accessible way to open the new task dialog required to create a manual task.

Observations:
- The page shows no interactive 'Add task' or '+' button in the interactive elements list.
- No form or controls for creating a new task are present among the available interactive elements.
- A floating '+' is visible in the screenshot but it is not exposed as an interactive element in the DOM listing, so it cannot be clicked by the test.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/d3fb4eea-165b-4c87-b995-9c0a0589c4c2/1e9e11b6-a2cd-4371-a1b3-a84632a3b62b
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC018 Handle invalid manual task input before saving
- **Test Code:** [TC018_Handle_invalid_manual_task_input_before_saving.py](./TC018_Handle_invalid_manual_task_input_before_saving.py)
- **Test Error:** TEST BLOCKED

The test could not be run — the UI provides no way to create a new task from the Tasks page, so manual-time task validation cannot be exercised.

Observations:
- No Add / + / "New Task" control is present in the interactive elements for the Tasks page.
- The page only shows filter controls (date range, project) and the message 'Nenhuma tarefa registrada no periodo.' with no visible create task dialog or button to open one.

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/d3fb4eea-165b-4c87-b995-9c0a0589c4c2/7f1ba2d7-12f9-4bf7-9efb-dbe929798635
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC019 Show validation when manual duration is zero
- **Test Code:** [TC019_Show_validation_when_manual_duration_is_zero.py](./TC019_Show_validation_when_manual_duration_is_zero.py)
- **Test Error:** TEST BLOCKED

The test could not be run — the UI control to create a new task is not reachable from the interactive elements provided.

Observations:
- The floating 'add new task' (+) button is visible in the page screenshot but is not present among the page's interactive elements.
- The interactive buttons on the page are indexes 3 (Tarefas), 11 (Projetos), 12 (De), and 13 (Limpar filtros); none open a new task dialog.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/d3fb4eea-165b-4c87-b995-9c0a0589c4c2/3d26174c-00f9-404d-88d0-b585fcf153d0
- **Status:** BLOCKED
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC020 Soft-delete a project without losing historical task labels
- **Test Code:** [TC020_Soft_delete_a_project_without_losing_historical_task_labels.py](./TC020_Soft_delete_a_project_without_losing_historical_task_labels.py)
- **Test Error:** TEST FAILURE

Soft-deleting the project did not remove it from the active project selection, although historical tasks still show the project label.

Observations:
- The project filter dropdown still includes 'Projeto SoftDelete 1' after clicking 'Remover'.
- The task list shows 'Tarefa SoftDelete 1' with the project label 'Projeto SoftDelete 1'.
- The UI did not reflect the project as removed from active selections after the removal action.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/d3fb4eea-165b-4c87-b995-9c0a0589c4c2/75c02b79-5178-445c-a64d-e1b00a5c2b7c
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC021 Soft-delete a project while keeping historical task associations
- **Test Code:** [TC021_Soft_delete_a_project_while_keeping_historical_task_associations.py](./TC021_Soft_delete_a_project_while_keeping_historical_task_associations.py)
- **Test Error:** TEST FAILURE

The project could not be removed — the 'Remover' button did not delete the project from the active list after multiple attempts.

Observations:
- The Projects list and the project filter dropdown still show 'Cliente Alfa'.
- Clicking 'Remover' did not change the UI; the project remained visible and no confirmation or error message appeared.
- The historical task 'Reunião com Cliente Alfa' still displays the project label 'Cliente Alfa'.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/d3fb4eea-165b-4c87-b995-9c0a0589c4c2/f69d2c10-0f36-4a7c-a047-00cd7ceb7568
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC022 Handle the empty task history state
- **Test Code:** [TC022_Handle_the_empty_task_history_state.py](./TC022_Handle_the_empty_task_history_state.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/d3fb4eea-165b-4c87-b995-9c0a0589c4c2/86945e2a-90a2-46f5-850b-e350ef17ea98
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **40.91** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---