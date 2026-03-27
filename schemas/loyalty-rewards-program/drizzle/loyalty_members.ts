// loyalty_members: Enrollment of a user in a loyalty program with cached point balances.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, integer, boolean, jsonb, timestamp, index, unique } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { loyaltyPrograms } from "./loyalty_programs";
import { users } from "./users";

export const loyaltyMemberStatus = pgEnum("loyalty_member_status", ["active", "suspended", "banned"]);

export const loyaltyMembers = pgTable("loyalty_members", {
    id: uuid("id").primaryKey().defaultRandom(),
    programId: uuid("program_id").notNull().references(() => loyaltyPrograms.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    memberNumber: text("member_number").unique().notNull(),
    status: loyaltyMemberStatus("status").notNull().default("active"),
    pointsBalance: integer("points_balance").notNull().default(0),
    pointsPending: integer("points_pending").notNull().default(0),
    lifetimePoints: integer("lifetime_points").notNull().default(0),
    pointsRedeemed: integer("points_redeemed").notNull().default(0),
    pointsExpired: integer("points_expired").notNull().default(0),
    enrolledAt: timestamp("enrolled_at", { withTimezone: true }).notNull().defaultNow(),
    suspendedAt: timestamp("suspended_at", { withTimezone: true }),
    metadata: jsonb("metadata").default(sql`'{}'`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  }, (table) => [
    unique("uq_loyalty_members_program_id_user_id").on(table.programId, table.userId),
    index("idx_loyalty_members_user_id").on(table.userId),
    index("idx_loyalty_members_status").on(table.status),
    index("idx_loyalty_members_points_balance").on(table.pointsBalance),
  ]
);
