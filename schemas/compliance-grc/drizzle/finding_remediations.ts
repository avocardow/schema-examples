// finding_remediations: Corrective actions assigned to resolve audit findings with priority and deadlines.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, index, pgEnum } from "drizzle-orm/pg-core";
import { auditFindings } from "./audit_findings";
import { users } from "./users";

export const remediationStatusEnum = pgEnum("remediation_status", [
  "pending",
  "in_progress",
  "completed",
  "cancelled",
]);

export const remediationPriorityEnum = pgEnum("remediation_priority", [
  "critical",
  "high",
  "medium",
  "low",
]);

export const findingRemediations = pgTable(
  "finding_remediations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    findingId: uuid("finding_id")
      .notNull()
      .references(() => auditFindings.id, { onDelete: "cascade" }),
    assignedTo: uuid("assigned_to").references(() => users.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    description: text("description"),
    status: remediationStatusEnum("status").notNull().default("pending"),
    priority: remediationPriorityEnum("priority").notNull().default("medium"),
    dueDate: text("due_date"),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_finding_remediations_finding_id").on(table.findingId),
    index("idx_finding_remediations_assigned_to").on(table.assignedTo),
    index("idx_finding_remediations_status").on(table.status),
    index("idx_finding_remediations_priority").on(table.priority),
    index("idx_finding_remediations_due_date").on(table.dueDate),
  ]
);
