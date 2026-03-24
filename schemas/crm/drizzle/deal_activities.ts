// deal_activities: append-only audit trail of deal changes for pipeline analytics.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { deals } from "./deals";
import { users } from "./users";

export const dealActivityActionEnum = pgEnum("deal_activity_action", [
  "created",
  "updated",
  "stage_changed",
  "won",
  "lost",
  "reopened",
]);

export const dealActivities = pgTable(
  "deal_activities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    dealId: uuid("deal_id").notNull().references(() => deals.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    action: dealActivityActionEnum("action").notNull(),
    field: text("field"),
    oldValue: text("old_value"),
    newValue: text("new_value"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_deal_activities_deal_id_created_at").on(table.dealId, table.createdAt),
    index("idx_deal_activities_user_id").on(table.userId),
  ]
);
