// rewards: Catalog of available rewards with points cost and inventory tracking.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, integer, boolean, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { loyaltyPrograms } from "./loyalty_programs";
import { tiers } from "./tiers";

export const rewardType = pgEnum("reward_type", [
  "discount_percentage",
  "discount_fixed",
  "free_product",
  "free_shipping",
  "gift_card",
  "experience",
  "custom",
]);

export const rewards = pgTable("rewards", {
    id: uuid("id").primaryKey().defaultRandom(),
    programId: uuid("program_id").notNull().references(() => loyaltyPrograms.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    rewardType: rewardType("reward_type").notNull(),
    pointsCost: integer("points_cost").notNull(),
    rewardValue: integer("reward_value"),
    currency: text("currency"),
    imageUrl: text("image_url"),
    inventory: integer("inventory"),
    maxRedemptionsPerMember: integer("max_redemptions_per_member"),
    isActive: boolean("is_active").notNull().default(true),
    minTierId: uuid("min_tier_id").references(() => tiers.id, { onDelete: "set null" }),
    metadata: jsonb("metadata"),
    sortOrder: integer("sort_order").notNull().default(0),
    validFrom: timestamp("valid_from", { withTimezone: true }),
    validUntil: timestamp("valid_until", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  }, (table) => [
    index("idx_rewards_program_id_is_active").on(table.programId, table.isActive),
    index("idx_rewards_reward_type").on(table.rewardType),
    index("idx_rewards_min_tier_id").on(table.minTierId),
  ]
);
