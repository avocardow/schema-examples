// audit_logs: Immutable event log for security-relevant actions.
// Append-only — never update or delete rows.
// Uses polymorphic actor/target (not FKs) so logs survive entity deletion.
// See README.md for full design rationale and field documentation.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { organizations } from "./organizations";

// Who (or what) performed the action. Not tied to a users FK — intentional.
export const auditActorType = pgEnum("audit_actor_type", [
  "user",
  "system",
  "api_key",
  "service",
]);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Structured event codes: resource.action.result
    // e.g., "user.login.success", "role.assigned", "session.impersonation.started"
    eventType: text("event_type").notNull(),

    // Polymorphic actor/target: NOT FKs. Audit logs must survive entity deletion.
    actorType: auditActorType("actor_type").notNull(),
    actorId: text("actor_id"), // user_id, api_key_id, or service name. Not a FK — intentional.
    targetType: text("target_type"), // e.g., "user", "organization", "role".
    targetId: text("target_id"), // Not a FK — same reason as actor_id.

    // on_delete set null (not cascade) — audit logs must survive org deletion.
    organizationId: uuid("organization_id").references(
      () => organizations.id,
      { onDelete: "set null" }
    ),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    metadata: jsonb("metadata"), // Event-specific details (e.g., {"old_role": "member", "new_role": "admin"}).
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(), // Immutable. Audit logs are append-only — never update or delete.
  },
  (table) => [
    index("idx_audit_logs_event_type").on(table.eventType),
    index("idx_audit_logs_actor").on(table.actorType, table.actorId),
    index("idx_audit_logs_target").on(table.targetType, table.targetId),
    index("idx_audit_logs_org_created")
      .on(table.organizationId, table.createdAt)
      .where(table.organizationId.isNotNull()),
    index("idx_audit_logs_created_at").on(table.createdAt),
  ]
);
