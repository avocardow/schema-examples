// compliance_activities: Audit trail of compliance-related actions across all entity types.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, jsonb, index, pgEnum } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { users } from "./users";

export const complianceActivityTypeEnum = pgEnum("compliance_activity_type", [
  "control_created",
  "control_updated",
  "control_tested",
  "risk_created",
  "risk_updated",
  "risk_closed",
  "policy_created",
  "policy_approved",
  "policy_acknowledged",
  "audit_started",
  "audit_completed",
  "finding_created",
  "finding_remediated",
  "finding_closed",
  "evidence_collected",
]);

export const complianceEntityTypeEnum = pgEnum("compliance_entity_type", [
  "control",
  "risk",
  "policy",
  "policy_version",
  "audit",
  "audit_finding",
  "finding_remediation",
  "evidence",
]);

export const complianceActivities = pgTable(
  "compliance_activities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").references(() => organizations.id, { onDelete: "cascade" }),
    actorId: uuid("actor_id").references(() => users.id, { onDelete: "set null" }),
    activityType: complianceActivityTypeEnum("activity_type").notNull(),
    entityType: complianceEntityTypeEnum("entity_type").notNull(),
    entityId: uuid("entity_id").notNull(),
    summary: text("summary").notNull(),
    details: jsonb("details"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_compliance_activities_organization_id").on(table.organizationId),
    index("idx_compliance_activities_actor_id").on(table.actorId),
    index("idx_compliance_activities_activity_type").on(table.activityType),
    index("idx_compliance_activities_entity_type").on(table.entityType),
    index("idx_compliance_activities_entity_id").on(table.entityId),
    index("idx_compliance_activities_created_at").on(table.createdAt),
  ]
);
