// automation_steps: Individual steps within an automation workflow sequence.
// See README.md for full design rationale.

import { pgTable, uuid, timestamp, index, unique, integer, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { automationWorkflows } from "./automation_workflows";
import { templates } from "./templates";

export const stepType = pgEnum("step_type", [
  "send_email",
  "delay",
  "condition",
]);

export const automationSteps = pgTable(
  "automation_steps",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workflowId: uuid("workflow_id").notNull().references(() => automationWorkflows.id, { onDelete: "cascade" }),
    stepOrder: integer("step_order").notNull(),
    stepType: stepType("step_type").notNull(),
    templateId: uuid("template_id").references(() => templates.id, { onDelete: "set null" }),
    config: jsonb("config").default(sql`'{}'`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_automation_steps_workflow_order").on(table.workflowId, table.stepOrder),
    index("idx_automation_steps_template_id").on(table.templateId),
  ],
);
