// member_activities: Log of member actions that may trigger earning rules.
// See README.md for full design rationale.

import { pgTable, uuid, text, integer, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { loyaltyMembers } from "./loyalty_members";
import { pointsTransactions } from "./points_transactions";

export const memberActivities = pgTable("member_activities", {
    id: uuid("id").primaryKey().defaultRandom(),
    memberId: uuid("member_id").notNull().references(() => loyaltyMembers.id, { onDelete: "cascade" }),
    activityType: text("activity_type").notNull(),
    description: text("description"),
    source: text("source"),
    referenceType: text("reference_type"),
    referenceId: text("reference_id"),
    monetaryValue: integer("monetary_value"),
    currency: text("currency"),
    pointsAwarded: integer("points_awarded"),
    transactionId: uuid("transaction_id").references(() => pointsTransactions.id, { onDelete: "set null" }),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  }, (table) => [
    index("idx_member_activities_member_id_created_at").on(table.memberId, table.createdAt),
    index("idx_member_activities_activity_type").on(table.activityType),
    index("idx_member_activities_reference").on(table.referenceType, table.referenceId),
    index("idx_member_activities_transaction_id").on(table.transactionId),
  ]
);
