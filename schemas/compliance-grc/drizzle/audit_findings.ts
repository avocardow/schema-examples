// audit_findings: Issues discovered during audits, linked to controls and risks with severity and status.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, index, pgEnum } from "drizzle-orm/pg-core";
import { audits } from "./audits";
import { controls } from "./controls";
import { risks } from "./risks";

export const findingSeverityEnum = pgEnum("finding_severity", [
  "critical",
  "high",
  "medium",
  "low",
  "informational",
]);

export const findingStatusEnum = pgEnum("finding_status", [
  "open",
  "in_progress",
  "remediated",
  "accepted",
  "closed",
]);

export const auditFindings = pgTable(
  "audit_findings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    auditId: uuid("audit_id")
      .notNull()
      .references(() => audits.id, { onDelete: "cascade" }),
    controlId: uuid("control_id").references(() => controls.id, { onDelete: "set null" }),
    riskId: uuid("risk_id").references(() => risks.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    description: text("description"),
    severity: findingSeverityEnum("severity").notNull(),
    status: findingStatusEnum("status").notNull().default("open"),
    dueDate: text("due_date"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_audit_findings_audit_id").on(table.auditId),
    index("idx_audit_findings_control_id").on(table.controlId),
    index("idx_audit_findings_risk_id").on(table.riskId),
    index("idx_audit_findings_severity").on(table.severity),
    index("idx_audit_findings_status").on(table.status),
  ]
);
