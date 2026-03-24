# Project Management

> Task and project tracking with custom workflows, labels, milestones, time tracking, and extensible custom fields.

## Overview

A complete project management schema supporting the full lifecycle of project-based work: creating projects, defining custom workflow statuses, organizing tasks into sections, assigning work to team members, tracking time, logging dependencies, and extending task data with custom fields. Covers individual and team project management use cases from simple to-do tracking to agile sprint planning.

Designed from a study of 10+ real implementations: SaaS platforms (Jira, Asana, Linear, ClickUp, Monday.com, Basecamp, Notion), open-source systems (Plane.so, Taiga), and developer tools (GitHub Issues/Projects).

Key design decisions:
- **Unified task model** over separate entity types — a single `tasks` table with a `type` enum (task, bug, story, epic) following the modern consensus from Linear, Asana, and Plane. Subtasks use self-referencing `parent_id` for unlimited nesting depth.
- **Project-scoped custom statuses** — each project defines its own workflow via `project_statuses` with an ordering field and a category enum (backlog, unstarted, started, completed, cancelled) for cross-project rollups.
- **Section-based grouping** — `task_lists` organize tasks within a project (board columns, list sections, sprint backlogs) following the Asana/Monday.com pattern.
- **Multiple assignees** — `task_assignees` junction table supports multiple people per task, following ClickUp and Monday.com.
- **Custom fields (EAV)** — `custom_fields` definitions with `custom_field_options` for select types and `custom_field_values` for per-task data. Industry-standard extensibility without schema changes.
- **Time tracking** — `time_entries` with start/end timestamps and computed duration for granular time logging, following the Jira worklog and ClickUp time tracking pattern.
- **Task dependencies** — `task_dependencies` with a relationship type enum (blocks, is_blocked_by, relates_to, duplicates) following Linear and Plane.
- **Activity audit trail** — `task_activities` as an append-only log of all task changes for full history reconstruction.

## Table of Contents

- [Overview](#overview)
- [Dependencies](#dependencies)
- [Tables](#tables)
- [Schema](#schema)

<details>
<summary>Schema table list (18 tables)</summary>

- [`projects`](#1-projects)
- [`project_members`](#2-project_members)
- [`project_statuses`](#3-project_statuses)
- [`task_lists`](#4-task_lists)
- [`tasks`](#5-tasks)
- [`task_assignees`](#6-task_assignees)
- [`labels`](#7-labels)
- [`task_labels`](#8-task_labels)
- [`milestones`](#9-milestones)
- [`task_dependencies`](#10-task_dependencies)
- [`custom_fields`](#11-custom_fields)
- [`custom_field_options`](#12-custom_field_options)
- [`custom_field_values`](#13-custom_field_values)
- [`task_comments`](#14-task_comments)
- [`task_attachments`](#15-task_attachments)
- [`time_entries`](#16-time_entries)
- [`task_activities`](#17-task_activities)
- [`task_views`](#18-task_views)

</details>

- [Relationships](#relationships)
- [Best Practices](#best-practices)
- [Formats](#formats)

## Dependencies

| Domain | Tables Used | Purpose |
| ------ | ----------- | ------- |
| [Auth / RBAC](../auth-rbac) | `users` | User identity for project members, task assignees, commenters, and activity actors |

> **File storage** is handled externally (e.g., the file-management domain). The `task_attachments` table stores file metadata and references without owning file storage infrastructure.

## Tables

### Core Project Structure
- `projects` — Top-level container for work with name, key prefix, visibility, and default settings
- `project_members` — Users who belong to a project with their role (owner, admin, member, viewer)
- `project_statuses` — Custom workflow statuses per project with ordering and category grouping

### Task Management
- `task_lists` — Sections or groups within a project for organizing tasks (board columns, list sections)
- `tasks` — The central work item with type, status, priority, assignees, dates, and estimates
- `task_assignees` — Multiple users assigned to a task

### Categorization
- `labels` — Color-coded labels scoped to a project for categorizing tasks
- `task_labels` — Many-to-many linking tasks to labels

### Planning
- `milestones` — Time-boxed iterations or feature milestones with start/end dates and progress tracking

### Relationships & Dependencies
- `task_dependencies` — Directed relationships between tasks (blocks, relates_to, duplicates)

### Extensibility
- `custom_fields` — Field definitions per project (text, number, date, select, multi_select, checkbox, url)
- `custom_field_options` — Predefined options for select/multi_select custom fields
- `custom_field_values` — Actual values stored for custom fields on specific tasks

### Collaboration
- `task_comments` — Threaded comments on tasks
- `task_attachments` — Files attached to tasks with metadata

### Tracking
- `time_entries` — Time logged against tasks by users
- `task_activities` — Append-only audit trail of all task changes

### Saved Views
- `task_views` — Saved filter, sort, and grouping configurations

## Schema

The pseudo code below is the **single source of truth** for all format implementations. See [CONTRIBUTING.md](../../CONTRIBUTING.md) for pseudo code conventions.

### 1. projects

Top-level container for all work. Each project has a unique key (short prefix like "PROJ" or "ENG") used to generate human-readable task identifiers (e.g., "ENG-142"). Projects control visibility, default settings, and serve as the scope for statuses, labels, custom fields, and milestones.

```pseudo
table projects {
  id              uuid primary_key default auto_generate
  name            string not_null              -- Project name (e.g., "Backend Rewrite", "Q2 Marketing").
  key             string unique not_null       -- Short prefix for task identifiers (e.g., "ENG", "MKT"). Uppercase, 2-10 chars.
  description     string nullable              -- Rich text project description.
  icon            string nullable              -- Emoji or icon identifier for the project.
  color           string nullable              -- Hex color for project display (e.g., "#4A90D9").
  visibility      enum(public, private) not_null default public
                                               -- public = visible to all workspace users.
                                               -- private = visible only to project members.
  task_count      integer not_null default 0   -- Denormalized count of tasks for quick display.
  created_by      uuid not_null references users(id) on_delete restrict
  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(created_by)                          -- "Projects created by this user."
    -- unique(key) is already created by the field constraint above.
  }
}
```

**Design notes:**
- `key` generates human-readable task IDs: project key + auto-incrementing number (e.g., "ENG-42"). The incrementing counter is an application concern (stored in-memory or computed from max task number).
- `task_count` is denormalized for list views. Updated via triggers or application logic on task create/delete.

### 2. project_members

Junction table linking users to projects with role-based access. Every project has at least one owner. Roles determine what actions a member can perform (view, create tasks, manage settings, delete project).

```pseudo
table project_members {
  id              uuid primary_key default auto_generate
  project_id      uuid not_null references projects(id) on_delete cascade
  user_id         uuid not_null references users(id) on_delete cascade
  role            enum(owner, admin, member, viewer) not_null default member
                                               -- owner = full control including delete project.
                                               -- admin = manage settings, members, statuses.
                                               -- member = create/edit tasks.
                                               -- viewer = read-only access.
  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    composite_unique(project_id, user_id)      -- One membership per user per project.
    index(user_id)                             -- "All projects this user belongs to."
    -- composite_unique(project_id, user_id) covers index(project_id) via leading column.
  }
}
```

### 3. project_statuses

Custom workflow statuses defined per project. Each project has its own set of ordered statuses (e.g., "Backlog", "To Do", "In Progress", "In Review", "Done"). The `category` field maps custom statuses to standard categories for cross-project rollups and default views.

```pseudo
table project_statuses {
  id              uuid primary_key default auto_generate
  project_id      uuid not_null references projects(id) on_delete cascade
  name            string not_null              -- Status display name (e.g., "In Progress", "QA Review").
  color           string nullable              -- Hex color for the status badge.
  category        enum(backlog, unstarted, started, completed, cancelled) not_null
                                               -- Standard category for cross-project queries.
                                               -- backlog = not yet prioritized.
                                               -- unstarted = prioritized but not started.
                                               -- started = actively being worked on.
                                               -- completed = finished successfully.
                                               -- cancelled = will not be done.
  position        integer not_null default 0   -- Display order within the project workflow.
  is_default      boolean not_null default false -- Whether this status is assigned to new tasks by default.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(project_id, position)                -- "Statuses for this project in workflow order."
    index(project_id, category)                -- "Statuses in this project by category."
  }
}
```

**Design notes:**
- `category` enables cross-project dashboards: "show all started tasks across all my projects" without knowing each project's custom status names.
- `is_default` marks the status assigned to newly created tasks. Typically one per project (enforce in application logic).
- Projects start with a default set of statuses (seeded by the application), which users can customize.

### 4. task_lists

Sections or groups within a project for organizing tasks. Maps to Asana sections, Monday.com groups, and Kanban board columns. Tasks belong to exactly one task list within a project. Lists are ordered within their project.

```pseudo
table task_lists {
  id              uuid primary_key default auto_generate
  project_id      uuid not_null references projects(id) on_delete cascade
  name            string not_null              -- List name (e.g., "Sprint 12", "Frontend", "Backlog").
  description     string nullable
  position        integer not_null default 0   -- Display order within the project.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(project_id, position)                -- "Lists for this project in display order."
  }
}
```

**Design notes:**
- Task lists are a lightweight organizational layer. They can represent board columns, sprint backlogs, feature areas, or any grouping the team prefers.
- Tasks reference `task_list_id` as an optional FK — tasks can exist without being in a list.

### 5. tasks

The central entity — a unit of work within a project. Uses a unified model where `type` distinguishes between tasks, bugs, stories, and epics. Subtasks are modeled via self-referencing `parent_id` for unlimited nesting. Each task has a human-readable number unique within its project (e.g., "ENG-42").

```pseudo
table tasks {
  id              uuid primary_key default auto_generate
  project_id      uuid not_null references projects(id) on_delete cascade
  task_list_id    uuid nullable references task_lists(id) on_delete set_null
                                               -- Which section/list this task belongs to. Null = unsectioned.
  parent_id       uuid nullable references tasks(id) on_delete cascade
                                               -- Parent task for subtasks. Null = top-level task. Cascade: deleting parent deletes subtasks.
  status_id       uuid nullable references project_statuses(id) on_delete set_null
                                               -- Current workflow status. Null if status was deleted.
  milestone_id    uuid nullable references milestones(id) on_delete set_null
                                               -- Associated milestone/sprint. Null = unplanned.

  -- Identification.
  number          integer not_null             -- Auto-incrementing number within the project (e.g., 42 in "ENG-42").
  title           string not_null              -- Task title/summary.
  description     string nullable              -- Rich text description with full details.

  -- Classification.
  type            enum(task, bug, story, epic) not_null default task
                                               -- task = generic work item.
                                               -- bug = defect or issue.
                                               -- story = user story / feature request.
                                               -- epic = large body of work containing other tasks.
  priority        enum(none, urgent, high, medium, low) not_null default none
                                               -- Urgency level. "none" = not yet triaged.

  -- Dates.
  due_date        string nullable              -- Due date in YYYY-MM-DD format. Contextual, not an absolute moment.
  start_date      string nullable              -- Planned start date in YYYY-MM-DD format.

  -- Estimation and progress.
  estimate_points integer nullable             -- Story points or effort estimate. Null = not estimated.
  position        integer not_null default 0   -- Display order within the task list or parent.

  -- Completion.
  completed_at    timestamp nullable           -- When the task was marked complete. Null = not completed.

  created_by      uuid not_null references users(id) on_delete restrict
  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    composite_unique(project_id, number)       -- Task numbers are unique within a project (e.g., one "ENG-42" per project).
    index(project_id, status_id)               -- "Tasks in this project with this status."
    index(task_list_id, position)              -- "Tasks in this list in display order."
    index(parent_id)                           -- "Subtasks of this parent task."
    index(milestone_id)                        -- "Tasks in this milestone/sprint."
    index(type)                                -- "All bugs" or "all epics."
    index(due_date)                            -- "Tasks due on or before this date."
    index(created_by)                          -- "Tasks created by this user."
    -- composite_unique(project_id, number) covers index(project_id) via leading column.
  }
}
```

**Design notes:**
- `number` is auto-incremented per project (application logic). Combined with `projects.key`, it forms "ENG-42" style identifiers.
- `due_date` and `start_date` are strings (YYYY-MM-DD) not timestamps — they represent calendar dates interpreted in the user's local context, not absolute UTC moments.
- `parent_id` with cascade delete means deleting a parent task removes all its subtasks. For epics, child tasks often have `type = task/story/bug` with `parent_id` pointing to the epic.
- `estimate_points` supports story points, t-shirt size mappings (stored as numeric equivalents), or any numeric estimation scheme.
- `priority` uses a five-level enum following Linear's pattern (none, urgent, high, medium, low).

### 6. task_assignees

Junction table for assigning multiple users to a task. Most PM tools support multiple assignees (ClickUp, Monday.com). Each assignee can have an optional role to distinguish the lead from helpers/reviewers.

```pseudo
table task_assignees {
  id              uuid primary_key default auto_generate
  task_id         uuid not_null references tasks(id) on_delete cascade
  user_id         uuid not_null references users(id) on_delete cascade
  role            enum(assignee, reviewer) not_null default assignee
                                               -- assignee = responsible for the work.
                                               -- reviewer = reviewing/approving the work.

  created_at      timestamp default now

  indexes {
    composite_unique(task_id, user_id)         -- One assignment per user per task.
    index(user_id)                             -- "All tasks assigned to this user."
    -- composite_unique(task_id, user_id) covers index(task_id) via leading column.
  }
}
```

### 7. labels

Color-coded labels scoped to a project for categorizing and filtering tasks. Labels are a lightweight, flexible tagging system that complements the structured `type` and `priority` fields. Examples: "frontend", "backend", "design", "documentation", "urgent-fix".

```pseudo
table labels {
  id              uuid primary_key default auto_generate
  project_id      uuid not_null references projects(id) on_delete cascade
  name            string not_null              -- Label display name (e.g., "frontend", "design").
  color           string nullable              -- Hex color (e.g., "#E11D48"). Null = default color.
  description     string nullable              -- Optional description of when to apply this label.
  position        integer not_null default 0   -- Display order in label picker.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    composite_unique(project_id, name)         -- Label names are unique within a project.
    -- composite_unique(project_id, name) covers index(project_id) via leading column.
  }
}
```

### 8. task_labels

Junction table linking tasks to labels. A task can have zero or more labels. Labels can be applied to any number of tasks within the same project.

```pseudo
table task_labels {
  id              uuid primary_key default auto_generate
  task_id         uuid not_null references tasks(id) on_delete cascade
  label_id        uuid not_null references labels(id) on_delete cascade

  created_at      timestamp default now

  indexes {
    composite_unique(task_id, label_id)        -- No duplicate labels on a task.
    index(label_id)                            -- "All tasks with this label."
    -- composite_unique(task_id, label_id) covers index(task_id) via leading column.
  }
}
```

### 9. milestones

Time-boxed iterations (sprints/cycles) or feature milestones within a project. Milestones group tasks for planning and progress tracking. A sprint is a milestone with start and end dates; a feature milestone might have only a target date. Status tracks the milestone lifecycle.

```pseudo
table milestones {
  id              uuid primary_key default auto_generate
  project_id      uuid not_null references projects(id) on_delete cascade
  name            string not_null              -- Milestone name (e.g., "Sprint 12", "v2.0 Release", "Q2 Goals").
  description     string nullable
  status          enum(planned, active, completed, cancelled) not_null default planned
                                               -- planned = not yet started.
                                               -- active = currently in progress (for sprints, the current sprint).
                                               -- completed = all work finished or sprint ended.
                                               -- cancelled = abandoned.
  start_date      string nullable              -- Start date in YYYY-MM-DD. Required for sprints/cycles.
  end_date        string nullable              -- End/target date in YYYY-MM-DD. Due date for feature milestones.
  position        integer not_null default 0   -- Display order.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(project_id, status)                  -- "Active milestones in this project."
    index(project_id, position)                -- "Milestones in display order."
  }
}
```

**Design notes:**
- Milestones serve dual purpose: time-boxed sprints (with start and end dates) and feature milestones (with just an end date as a target).
- `status` uses four states. For sprints: planned → active → completed. Only one milestone should be `active` per project at a time (enforce in application logic).
- Tasks reference `milestone_id` — when a milestone is deleted, tasks become unplanned (`on_delete set_null`).

### 10. task_dependencies

Directed relationships between tasks. Supports blocking dependencies (task A blocks task B), general relations, and duplicate linking. Follows the Linear/Plane pattern of typed issue relations.

```pseudo
table task_dependencies {
  id              uuid primary_key default auto_generate
  task_id         uuid not_null references tasks(id) on_delete cascade
                                               -- The source task.
  depends_on_id   uuid not_null references tasks(id) on_delete cascade
                                               -- The target task.
  type            enum(blocks, is_blocked_by, relates_to, duplicates) not_null
                                               -- blocks = task_id blocks depends_on_id from starting.
                                               -- is_blocked_by = task_id is blocked by depends_on_id.
                                               -- relates_to = general relationship, no blocking.
                                               -- duplicates = task_id is a duplicate of depends_on_id.

  created_at      timestamp default now

  indexes {
    composite_unique(task_id, depends_on_id, type) -- No duplicate relationships of the same type.
    index(depends_on_id)                       -- "What depends on this task?"
    -- composite_unique(task_id, depends_on_id, type) covers index(task_id) via leading column.
  }
}
```

**Design notes:**
- Dependencies are directional: "Task A blocks Task B" is stored as `(task_id=A, depends_on_id=B, type=blocks)`.
- `blocks` and `is_blocked_by` are inverses. Applications can store one direction and infer the other, or store both explicitly. The schema supports both approaches.
- `relates_to` is a non-directional link. `duplicates` marks a task as a duplicate of another.

### 11. custom_fields

Field definitions for custom data per project. Each custom field has a name, type, and optional configuration. Custom fields allow teams to extend tasks with project-specific data (e.g., "Sprint Points", "Customer Name", "Release Version") without schema changes. Follows the Jira/ClickUp/Asana pattern.

```pseudo
table custom_fields {
  id              uuid primary_key default auto_generate
  project_id      uuid not_null references projects(id) on_delete cascade
  name            string not_null              -- Field label (e.g., "Sprint Points", "Customer").
  field_type      enum(text, number, date, select, multi_select, checkbox, url) not_null
  description     string nullable              -- Help text explaining the field's purpose.
  is_required     boolean not_null default false -- Whether this field must be filled on every task.
  position        integer not_null default 0   -- Display order in forms and detail views.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(project_id, position)                -- "Custom fields for this project in display order."
  }
}
```

**Design notes:**
- `field_type` determines validation and UI rendering. `select` and `multi_select` types have predefined options stored in `custom_field_options`.
- Custom fields are project-scoped — each project can define different fields.
- `is_required` is enforced at the application level, not the database level, since custom field values are in a separate table.

### 12. custom_field_options

Predefined options for `select` and `multi_select` custom fields. Each option has a value, optional color, and ordering. Only used for custom fields with `field_type = select` or `field_type = multi_select`.

```pseudo
table custom_field_options {
  id              uuid primary_key default auto_generate
  custom_field_id uuid not_null references custom_fields(id) on_delete cascade
  value           string not_null              -- Option display value (e.g., "High", "Medium", "Low").
  color           string nullable              -- Hex color for visual distinction.
  position        integer not_null default 0   -- Display order in dropdowns.

  created_at      timestamp default now

  indexes {
    index(custom_field_id, position)           -- "Options for this field in display order."
  }
}
```

### 13. custom_field_values

Actual values stored for custom fields on specific tasks. Uses the EAV (Entity-Attribute-Value) pattern — one row per field per task. All values are stored as strings regardless of field type; the application validates and casts based on `custom_fields.field_type`.

```pseudo
table custom_field_values {
  id              uuid primary_key default auto_generate
  task_id         uuid not_null references tasks(id) on_delete cascade
  custom_field_id uuid not_null references custom_fields(id) on_delete cascade
  value           string not_null              -- Value stored as string. Numbers as "42", dates as "2025-03-15",
                                               -- booleans as "true"/"false", select as the option value,
                                               -- multi_select as JSON array string.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    composite_unique(task_id, custom_field_id) -- One value per field per task.
    index(custom_field_id)                     -- "All values for this custom field" (for analytics/filtering).
    -- composite_unique(task_id, custom_field_id) covers index(task_id) via leading column.
  }
}
```

### 14. task_comments

Discussion threads on tasks. Each comment belongs to a task and optionally to a parent comment for threading. Supports rich text content. Comments are soft-preserved when users are deleted (`on_delete set_null` on `user_id`).

```pseudo
table task_comments {
  id              uuid primary_key default auto_generate
  task_id         uuid not_null references tasks(id) on_delete cascade
  user_id         uuid nullable references users(id) on_delete set_null
                                               -- Comment author. Null if user was deleted (preserves comment).
  parent_id       uuid nullable references task_comments(id) on_delete cascade
                                               -- Parent comment for threaded replies. Null = top-level comment.
  content         string not_null              -- Comment body (rich text / markdown).

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(task_id)                             -- "All comments on this task."
    index(parent_id)                           -- "Replies to this comment."
    index(user_id)                             -- "All comments by this user."
  }
}
```

### 15. task_attachments

Files attached to tasks. Stores file metadata and a reference URL or path. Actual file storage is handled by an external system (file-management domain, S3, etc.). Attachments are associated with a task and the user who uploaded them.

```pseudo
table task_attachments {
  id              uuid primary_key default auto_generate
  task_id         uuid not_null references tasks(id) on_delete cascade
  uploaded_by     uuid nullable references users(id) on_delete set_null
  file_name       string not_null              -- Original file name (e.g., "screenshot.png").
  file_url        string not_null              -- URL or storage path to the file.
  file_size       integer nullable             -- File size in bytes.
  mime_type       string nullable              -- MIME type (e.g., "image/png", "application/pdf").

  created_at      timestamp default now

  indexes {
    index(task_id)                             -- "All attachments on this task."
    index(uploaded_by)                         -- "All attachments uploaded by this user."
  }
}
```

### 16. time_entries

Time logged against tasks by users. Each entry records a work session with start and end timestamps or a manual duration. Supports descriptions for documenting what work was done. Follows the Jira worklog and ClickUp time tracking pattern.

```pseudo
table time_entries {
  id              uuid primary_key default auto_generate
  task_id         uuid not_null references tasks(id) on_delete cascade
  user_id         uuid not_null references users(id) on_delete cascade
  description     string nullable              -- What work was done during this time (e.g., "Fixed login bug").
  start_time      timestamp nullable           -- When the work session started. Null for manual duration entries.
  end_time        timestamp nullable           -- When the work session ended. Null for manual duration entries.
  duration        integer not_null             -- Duration in seconds. Computed from start/end or entered manually.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(task_id)                             -- "All time entries for this task."
    index(user_id, start_time)                 -- "Time entries by this user, ordered by date."
  }
}
```

**Design notes:**
- `start_time` and `end_time` are nullable to support both timer-based tracking (start/stop) and manual entry (just a duration).
- `duration` is always populated — either computed from start/end or entered directly. Stored in seconds for precision.
- Time entries are hard-deleted with the task (`on_delete cascade`). For audit purposes, the `task_activities` table captures when time entries are created/modified.

### 17. task_activities

Append-only audit trail of all changes to tasks. Records who changed what, when, and the old/new values. Used for activity feeds ("Alice changed status from 'To Do' to 'In Progress'") and change history. Follows the Plane/Taiga activity pattern.

```pseudo
table task_activities {
  id              uuid primary_key default auto_generate
  task_id         uuid not_null references tasks(id) on_delete cascade
  user_id         uuid nullable references users(id) on_delete set_null
                                               -- Who performed the action. Null if user was deleted or system-generated.
  action          enum(created, updated, commented, assigned, unassigned, labeled, unlabeled, moved, archived, restored) not_null
                                               -- created = task was created.
                                               -- updated = a field was changed.
                                               -- commented = a comment was added.
                                               -- assigned/unassigned = assignee added/removed.
                                               -- labeled/unlabeled = label added/removed.
                                               -- moved = task moved between lists or projects.
                                               -- archived/restored = task archived or restored.
  field           string nullable              -- Which field changed (e.g., "status", "priority", "title"). Null for non-update actions.
  old_value       string nullable              -- Previous value as string. Null for "created" or when not applicable.
  new_value       string nullable              -- New value as string. Null for "unassigned"/"unlabeled" or when not applicable.

  created_at      timestamp default now

  indexes {
    index(task_id, created_at)                 -- "Activity feed for this task, newest first."
    index(user_id)                             -- "All activity by this user."
  }
}
```

**Design notes:**
- This is an append-only table — rows are never updated or deleted (except via cascade when the task is deleted).
- `old_value` and `new_value` are stored as strings for uniformity (status names, user IDs, priority labels, etc.).
- `action` enum covers the most common PM actions. The application maps each action type to a human-readable message.

### 18. task_views

Saved filter, sort, and grouping configurations for tasks. Users or teams can save custom views of their project board (e.g., "My Open Bugs", "Sprint Board", "Overdue Tasks"). Views store their configuration as JSON. Follows the Linear/Asana/ClickUp saved views pattern.

```pseudo
table task_views {
  id              uuid primary_key default auto_generate
  project_id      uuid not_null references projects(id) on_delete cascade
  created_by      uuid not_null references users(id) on_delete cascade
  name            string not_null              -- View name (e.g., "My Open Bugs", "Sprint Board").
  description     string nullable
  layout          enum(list, board, calendar, timeline) not_null default list
                                               -- How tasks are displayed.
  filters         json nullable                -- JSON filter criteria (e.g., {"status": ["in_progress"], "priority": ["high"]}).
  sort_by         json nullable                -- JSON sort configuration (e.g., [{"field": "priority", "direction": "desc"}]).
  group_by        string nullable              -- Field to group tasks by (e.g., "status", "assignee", "priority").
  is_shared       boolean not_null default false -- Whether this view is visible to all project members.
  position        integer not_null default 0   -- Display order in the views sidebar.

  created_at      timestamp default now
  updated_at      timestamp default now on_update

  indexes {
    index(project_id, position)                -- "Views for this project in display order."
    index(created_by)                          -- "Views created by this user."
  }
}
```

**Design notes:**
- `filters` and `sort_by` are JSON to support arbitrary filter combinations without a separate filter rules table. The application validates the JSON structure.
- `layout` determines the visual representation: list view, kanban board, calendar, or timeline/Gantt.
- `is_shared = false` means the view is personal (only visible to the creator). `true` shares it with all project members.

## Relationships

```
projects           1 ──── * project_members        (one project has many members)
projects           1 ──── * project_statuses        (one project defines many statuses)
projects           1 ──── * task_lists              (one project has many task lists)
projects           1 ──── * tasks                   (one project has many tasks)
projects           1 ──── * labels                  (one project has many labels)
projects           1 ──── * milestones              (one project has many milestones)
projects           1 ──── * custom_fields           (one project has many custom fields)
projects           1 ──── * task_views              (one project has many saved views)
project_statuses   1 ──── * tasks                   (one status applied to many tasks)
task_lists         1 ──── * tasks                   (one list contains many tasks)
tasks              1 ──── * tasks                   (self-referencing: parent has many subtasks)
tasks              1 ──── * task_assignees           (one task has many assignees)
tasks              1 ──── * task_labels              (one task has many labels)
tasks              1 ──── * task_dependencies        (one task has many dependencies)
tasks              1 ──── * custom_field_values      (one task has many custom field values)
tasks              1 ──── * task_comments            (one task has many comments)
tasks              1 ──── * task_attachments          (one task has many attachments)
tasks              1 ──── * time_entries             (one task has many time entries)
tasks              1 ──── * task_activities           (one task has many activity records)
task_comments      1 ──── * task_comments            (self-referencing: comment has many replies)
milestones         1 ──── * tasks                   (one milestone contains many tasks)
labels             1 ──── * task_labels              (one label applied to many tasks)
custom_fields      1 ──── * custom_field_options     (one field has many select options)
custom_fields      1 ──── * custom_field_values      (one field has many values across tasks)
users              1 ──── * projects                (one user creates many projects)
users              1 ──── * project_members          (one user belongs to many projects)
users              1 ──── * tasks                   (one user creates many tasks)
users              1 ──── * task_assignees           (one user assigned to many tasks)
users              1 ──── * task_comments            (one user writes many comments)
users              1 ──── * task_attachments          (one user uploads many attachments)
users              1 ──── * time_entries             (one user logs many time entries)
users              1 ──── * task_activities           (one user generates many activity records)
users              1 ──── * task_views               (one user creates many views)
```

## Best Practices

- **Task numbering**: Auto-increment `tasks.number` per project at the application level. Use `projects.key` + `tasks.number` to display human-readable identifiers (e.g., "ENG-42"). Store the number, not the composite string.
- **Status workflow**: Seed default statuses when creating a project. Let users customize status names and order, but enforce the `category` mapping so cross-project queries work consistently.
- **Denormalized counts**: Keep `projects.task_count` updated via triggers or application logic. Avoid COUNT(*) queries on large projects.
- **Position ordering**: Use integer positions for ordering tasks, lists, labels, and statuses. When reordering, update affected rows. For high-frequency reordering, consider fractional ranking (LexoRank) at the application level.
- **Subtask depth**: While the schema supports unlimited subtask nesting via `parent_id`, recommend limiting to 2-3 levels in the application for usability.
- **Custom field validation**: Validate custom field values at the application level based on `custom_fields.field_type`. The database stores all values as strings for uniformity.
- **Activity feed performance**: The `task_activities` table grows linearly with every change. Add a retention policy or archive old activities for large-scale deployments.
- **Time entry reconciliation**: When both `start_time`/`end_time` and `duration` are provided, the application should ensure `duration = end_time - start_time`. For manual entries, only `duration` is set.
- **Soft deletes**: Consider adding `archived_at` timestamp to tasks for soft-delete/archive functionality rather than hard deleting. The current schema uses cascade deletes for simplicity.
- **Access control**: Use `project_members.role` for authorization checks. Reference the Auth / RBAC domain for workspace-level permissions.

## Formats

| Format      | Status |
| ----------- | ------ |
| Convex      | ✅ Done |
| SQL         | ✅ Done |
| Prisma      | ✅ Done |
| MongoDB     | ✅ Done |
| Drizzle     | ✅ Done |
| SpacetimeDB | ✅ Done |
| Firebase    | ✅ Done |
