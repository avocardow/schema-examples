// notification_workflow_steps: Individual steps within a workflow, executed in order by step_order.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  integer,
  jsonb,
  boolean,
  timestamp,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { notificationWorkflows } from "./notification_workflows";
import { channelType } from "./notification_channels";

export const stepType = pgEnum("step_type", [
  "channel",
  "delay",
  "digest",
  "condition",
  "throttle",
]);

export const notificationWorkflowSteps = pgTable(
  "notification_workflow_steps",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workflowId: uuid("workflow_id")
      .notNull()
      .references(() => notificationWorkflows.id, { onDelete: "cascade" }),

    stepOrder: integer("step_order").notNull(), // Execution order within the workflow. Steps run in ascending order.

    stepType: stepType("step_type").notNull(),

    // For channel steps: which channel type to deliver to. Null for non-channel step types.
    channelType: channelType("channel_type"),

    // Step configuration as JSON. Schema depends on step_type.
    config: jsonb("config").default(sql`'{}'`),

    // Should the workflow stop if this step fails?
    // true = abort remaining steps (fail-fast). false = continue to next step (best-effort).
    shouldStopOnFail: boolean("should_stop_on_fail").notNull().default(false),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    unique("uq_workflow_steps_workflow_id_step_order").on(
      table.workflowId,
      table.stepOrder
    ),
    index("idx_notification_workflow_steps_workflow_id").on(table.workflowId),
  ]
);
