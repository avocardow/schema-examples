// programs: Affiliate/referral programs with commission rules and attribution settings.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, numeric, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const programStatus = pgEnum("program_status", ["draft", "active", "paused", "archived"]);

export const commissionType = pgEnum("program_commission_type", ["percentage", "flat", "hybrid"]);

export const attributionModel = pgEnum("program_attribution_model", ["first_touch", "last_touch"]);

export const programs = pgTable("programs", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").unique().notNull(),
    description: text("description"),
    status: programStatus("status").notNull().default("draft"),
    commissionType: commissionType("commission_type").notNull().default("percentage"),
    commissionPercentage: numeric("commission_percentage"),
    commissionFlat: integer("commission_flat"),
    currency: text("currency").notNull(),
    cookieDuration: integer("cookie_duration").notNull().default(30),
    attributionModel: attributionModel("attribution_model").notNull().default("last_touch"),
    minPayout: integer("min_payout").notNull().default(0),
    autoApprove: boolean("auto_approve").notNull().default(false),
    isPublic: boolean("is_public").notNull().default(true),
    termsUrl: text("terms_url"),
    createdBy: uuid("created_by").notNull().references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  }, (table) => [
    index("idx_programs_status").on(table.status),
    index("idx_programs_created_by").on(table.createdBy),
  ]
);
