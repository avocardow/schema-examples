// tiers: Tier/VIP level definitions with qualification thresholds and ordering.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, integer, boolean, jsonb, timestamp, index, unique } from "drizzle-orm/pg-core";
import { loyaltyPrograms } from "./loyalty_programs";

export const tierQualificationType = pgEnum("tier_qualification_type", ["points_earned", "amount_spent", "transaction_count"]);

export const tiers = pgTable("tiers", {
    id: uuid("id").primaryKey().defaultRandom(),
    programId: uuid("program_id").notNull().references(() => loyaltyPrograms.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    position: integer("position").notNull(),
    qualificationType: tierQualificationType("qualification_type").notNull().default("points_earned"),
    qualificationValue: integer("qualification_value").notNull(),
    qualificationPeriodDays: integer("qualification_period_days"),
    retainDays: integer("retain_days"),
    iconUrl: text("icon_url"),
    color: text("color"),
    isDefault: boolean("is_default").notNull().default(false),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  }, (table) => [
    unique("uq_tiers_program_id_slug").on(table.programId, table.slug),
    unique("uq_tiers_program_id_position").on(table.programId, table.position),
    index("idx_tiers_is_default").on(table.isDefault),
  ]
);
