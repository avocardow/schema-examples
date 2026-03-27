// member_tiers: Assignment of members to tiers with temporal tracking and history.
// See README.md for full design rationale.

import { pgTable, uuid, boolean, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { loyaltyMembers } from "./loyalty_members";
import { tiers } from "./tiers";

export const memberTiers = pgTable("member_tiers", {
    id: uuid("id").primaryKey().defaultRandom(),
    memberId: uuid("member_id").notNull().references(() => loyaltyMembers.id, { onDelete: "cascade" }),
    tierId: uuid("tier_id").notNull().references(() => tiers.id, { onDelete: "cascade" }),
    isCurrent: boolean("is_current").notNull().default(true),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    qualificationSnapshot: jsonb("qualification_snapshot"),
    isManual: boolean("is_manual").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  }, (table) => [
    index("idx_member_tiers_member_id_is_current").on(table.memberId, table.isCurrent),
    index("idx_member_tiers_tier_id").on(table.tierId),
    index("idx_member_tiers_ends_at").on(table.endsAt),
  ]
);
