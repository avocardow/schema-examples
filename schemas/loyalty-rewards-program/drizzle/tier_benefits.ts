// tier_benefits: Specific benefits unlocked at each tier (multipliers, perks, access).
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, boolean, integer, timestamp, index } from "drizzle-orm/pg-core";
import { tiers } from "./tiers";

export const benefitType = pgEnum("benefit_type", [
  "points_multiplier",
  "free_shipping",
  "early_access",
  "birthday_bonus",
  "exclusive_rewards",
  "priority_support",
  "custom",
]);

export const tierBenefits = pgTable("tier_benefits", {
    id: uuid("id").primaryKey().defaultRandom(),
    tierId: uuid("tier_id").notNull().references(() => tiers.id, { onDelete: "cascade" }),
    benefitType: benefitType("benefit_type").notNull(),
    value: text("value"),
    description: text("description").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  }, (table) => [
    index("idx_tier_benefits_tier_id").on(table.tierId),
    index("idx_tier_benefits_benefit_type").on(table.benefitType),
  ]
);
