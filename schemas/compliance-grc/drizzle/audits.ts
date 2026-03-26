// audits: Compliance audits and assessments with type, status, scope, and scheduling.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, index, pgEnum } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { users } from "./users";

export const auditTypeEnum = pgEnum("audit_type", [
  "internal",
  "external",
  "self_assessment",
  "certification",
]);

export const auditStatusEnum = pgEnum("audit_status", [
  "planned",
  "in_progress",
  "review",
  "completed",
  "cancelled",
]);

export const audits = pgTable(
  "audits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").references(() => organizations.id, { onDelete: "cascade" }),
    leadAuditorId: uuid("lead_auditor_id").references(() => users.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    auditType: auditTypeEnum("audit_type").notNull(),
    status: auditStatusEnum("status").notNull().default("planned"),
    scope: text("scope"),
    startDate: text("start_date"),
    endDate: text("end_date"),
    conclusion: text("conclusion"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_audits_organization_id").on(table.organizationId),
    index("idx_audits_lead_auditor_id").on(table.leadAuditorId),
    index("idx_audits_audit_type").on(table.auditType),
    index("idx_audits_status").on(table.status),
  ]
);
