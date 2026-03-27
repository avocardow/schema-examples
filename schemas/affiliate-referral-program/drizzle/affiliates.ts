// affiliates: Individual affiliate accounts linked to a program and user.
// Each affiliate gets a unique referral code and optional coupon code.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, numeric, timestamp, jsonb, index, unique } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { programs } from "./programs";
import { users } from "./users";

export const affiliateStatusEnum = pgEnum("affiliate_status", ["pending", "active", "suspended", "rejected"]);

export const affiliates = pgTable(
  "affiliates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    programId: uuid("program_id").notNull().references(() => programs.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    referralCode: text("referral_code").notNull().unique(),
    couponCode: text("coupon_code"),
    status: affiliateStatusEnum("status").notNull().default("pending"),
    customCommissionRate: numeric("custom_commission_rate"),
    payoutMethod: text("payout_method"),
    payoutEmail: text("payout_email"),
    metadata: jsonb("metadata").default(sql`'{}'`),
    referredBy: uuid("referred_by").references(() => affiliates.id, { onDelete: "set null" }),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    suspendedAt: timestamp("suspended_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  },
  (table) => [
    unique("affiliates_program_id_user_id_unique").on(table.programId, table.userId),
    index("idx_affiliates_user_id").on(table.userId),
    index("idx_affiliates_status").on(table.status),
    index("idx_affiliates_referred_by").on(table.referredBy),
  ]
);
