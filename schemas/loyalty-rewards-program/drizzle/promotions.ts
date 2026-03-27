// promotions: Time-limited bonus earning campaigns (multipliers, fixed bonuses).
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, integer, numeric, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { loyaltyPrograms } from "./loyalty_programs";

export const promotionType = pgEnum("promotion_type", ["multiplier", "fixed_bonus"]);

export const promotionStatus = pgEnum("promotion_status", ["scheduled", "active", "ended", "canceled"]);

export const promotions = pgTable("promotions", {
    id: uuid("id").primaryKey().defaultRandom(),
    programId: uuid("program_id").notNull().references(() => loyaltyPrograms.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    promotionType: promotionType("promotion_type").notNull().default("multiplier"),
    multiplier: numeric("multiplier"),
    bonusPoints: integer("bonus_points"),
    eventType: text("event_type"),
    conditions: jsonb("conditions"),
    status: promotionStatus("status").notNull().default("scheduled"),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
    maxPointsPerMember: integer("max_points_per_member"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  }, (table) => [
    index("idx_promotions_program_id_status").on(table.programId, table.status),
    index("idx_promotions_status").on(table.status),
    index("idx_promotions_starts_at_ends_at").on(table.startsAt, table.endsAt),
  ]
);
