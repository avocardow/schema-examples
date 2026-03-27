// referrals: Tracks visitor-to-lead-to-conversion journey for each affiliate.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { affiliates } from "./affiliates";
import { clicks } from "./clicks";

export const referralStatus = pgEnum("referral_status", ["visit", "lead", "converted", "expired"]);

export const referrals = pgTable("referrals", {
    id: uuid("id").primaryKey().defaultRandom(),
    affiliateId: uuid("affiliate_id").notNull().references(() => affiliates.id, { onDelete: "cascade" }),
    clickId: uuid("click_id").references(() => clicks.id, { onDelete: "set null" }),
    visitorId: text("visitor_id"),
    email: text("email"),
    status: referralStatus("status").notNull().default("visit"),
    landingUrl: text("landing_url"),
    metadata: jsonb("metadata"),
    convertedAt: timestamp("converted_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  }, (table) => [
    index("idx_referrals_affiliate_id_status").on(table.affiliateId, table.status),
    index("idx_referrals_status").on(table.status),
    index("idx_referrals_email").on(table.email),
    index("idx_referrals_visitor_id").on(table.visitorId),
  ]
);
