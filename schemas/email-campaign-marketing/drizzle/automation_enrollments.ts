// automation_enrollments: Tracks contacts progressing through automation workflows.
// See README.md for full design rationale.

import { pgTable, uuid, timestamp, index, unique, pgEnum } from "drizzle-orm/pg-core";
import { automationWorkflows } from "./automation_workflows";
import { contacts } from "./contacts";
import { automationSteps } from "./automation_steps";

export const enrollmentStatus = pgEnum("enrollment_status", [
  "active",
  "completed",
  "paused",
  "exited",
]);

export const automationEnrollments = pgTable(
  "automation_enrollments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workflowId: uuid("workflow_id").notNull().references(() => automationWorkflows.id, { onDelete: "cascade" }),
    contactId: uuid("contact_id").notNull().references(() => contacts.id, { onDelete: "cascade" }),
    currentStepId: uuid("current_step_id").references(() => automationSteps.id, { onDelete: "set null" }),
    status: enrollmentStatus("status").notNull().default("active"),
    enrolledAt: timestamp("enrolled_at", { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_automation_enrollments_workflow_contact").on(table.workflowId, table.contactId),
    index("idx_automation_enrollments_contact_id").on(table.contactId),
    index("idx_automation_enrollments_status").on(table.status),
  ],
);
