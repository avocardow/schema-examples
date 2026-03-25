// ticket_activities: append-only audit trail of ticket changes for accountability and SLA debugging.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { tickets } from "./tickets";
import { users } from "./users";

export const ticketActivityActionEnum = pgEnum("ticket_activity_action", [
  "created",
  "updated",
  "status_changed",
  "priority_changed",
  "assigned",
  "escalated",
  "reopened",
  "resolved",
  "closed",
  "sla_breached",
]);

export const ticketActivities = pgTable(
  "ticket_activities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ticketId: uuid("ticket_id").notNull().references(() => tickets.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    action: ticketActivityActionEnum("action").notNull(),
    field: text("field"),
    oldValue: text("old_value"),
    newValue: text("new_value"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_ticket_activities_ticket_id_created_at").on(table.ticketId, table.createdAt),
    index("idx_ticket_activities_user_id").on(table.userId),
  ]
);
