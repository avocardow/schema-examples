// items: Auction items listed by sellers with condition grading and category classification.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "../../auth-rbac/drizzle/users";
import { categories } from "./categories";

export const itemCondition = pgEnum("item_condition", [
  "new",
  "like_new",
  "excellent",
  "good",
  "fair",
  "poor",
]);

export const items = pgTable(
  "items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sellerId: uuid("seller_id").notNull().references(() => users.id, { onDelete: "restrict" }),
    categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    description: text("description"),
    condition: itemCondition("condition").notNull().default("new"),
    conditionNotes: text("condition_notes"),
    metadata: jsonb("metadata").default(sql`'{}'`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_items_seller_id").on(table.sellerId),
    index("idx_items_category_id").on(table.categoryId),
    index("idx_items_condition").on(table.condition),
  ]
);
