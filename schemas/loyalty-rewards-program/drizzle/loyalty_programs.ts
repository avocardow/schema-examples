// loyalty_programs: Top-level loyalty program configuration with currency, earning, and expiration settings.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, numeric, integer, boolean, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users";

export const loyaltyProgramStatus = pgEnum("loyalty_program_status", ["draft", "active", "paused", "archived"]);

export const loyaltyPrograms = pgTable("loyalty_programs", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").unique().notNull(),
    description: text("description"),
    status: loyaltyProgramStatus("status").notNull().default("draft"),
    currencyName: text("currency_name").notNull().default("points"),
    pointsPerCurrency: numeric("points_per_currency").notNull().default("1"),
    currency: text("currency"),
    pointsExpiryDays: integer("points_expiry_days"),
    allowNegative: boolean("allow_negative").notNull().default(false),
    isPublic: boolean("is_public").notNull().default(true),
    termsUrl: text("terms_url"),
    metadata: jsonb("metadata").default(sql`'{}'`),
    createdBy: uuid("created_by").notNull().references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  }, (table) => [
    index("idx_loyalty_programs_status").on(table.status),
    index("idx_loyalty_programs_created_by").on(table.createdBy),
  ]
);
