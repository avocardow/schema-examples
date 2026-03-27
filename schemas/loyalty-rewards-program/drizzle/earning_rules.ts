// earning_rules: Rules defining how members earn points (event type, amount, conditions).
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, integer, numeric, boolean, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { loyaltyPrograms } from "./loyalty_programs";

export const earningType = pgEnum("earning_type", ["fixed", "per_currency", "multiplier"]);

export const earningRules = pgTable("earning_rules", {
    id: uuid("id").primaryKey().defaultRandom(),
    programId: uuid("program_id").notNull().references(() => loyaltyPrograms.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    eventType: text("event_type").notNull(),
    earningType: earningType("earning_type").notNull().default("fixed"),
    pointsAmount: integer("points_amount"),
    multiplier: numeric("multiplier"),
    minPurchaseAmount: integer("min_purchase_amount"),
    maxPointsPerEvent: integer("max_points_per_event"),
    conditions: jsonb("conditions"),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  }, (table) => [
    index("idx_earning_rules_program_id_is_active").on(table.programId, table.isActive),
    index("idx_earning_rules_event_type").on(table.eventType),
  ]
);
