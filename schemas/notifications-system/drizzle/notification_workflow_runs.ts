// notification_workflow_runs: Execution instances of a workflow. Tracks state for monitoring, debugging, and retry.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  integer,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { notificationWorkflows } from "./notification_workflows";
import { notificationEvents } from "./notification_events";
import { notificationWorkflowSteps } from "./notification_workflow_steps";

export const workflowRunStatus = pgEnum("workflow_run_status", [
  "pending",
  "running",
  "completed",
  "failed",
  "canceled",
]);

export const notificationWorkflowRuns = pgTable(
  "notification_workflow_runs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workflowId: uuid("workflow_id")
      .notNull()
      .references(() => notificationWorkflows.id, { onDelete: "cascade" }),
    eventId: uuid("event_id")
      .notNull()
      .references(() => notificationEvents.id, { onDelete: "cascade" }),

    // Execution lifecycle.
    status: workflowRunStatus("status").notNull().default("pending"),

    // Which step the workflow is currently on (or last completed).
    currentStepOrder: integer("current_step_order"),

    // Error details if the run failed.
    errorMessage: text("error_message"), // Human-readable description of what went wrong.
    errorStepId: uuid("error_step_id").references(
      () => notificationWorkflowSteps.id,
      { onDelete: "set null" }
    ), // Which step caused the failure.

    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_notification_workflow_runs_workflow_id_status").on(
      table.workflowId,
      table.status
    ),
    index("idx_notification_workflow_runs_event_id").on(table.eventId),
    index("idx_notification_workflow_runs_status_created_at").on(
      table.status,
      table.createdAt
    ),
    index("idx_notification_workflow_runs_created_at").on(table.createdAt),
  ]
);
