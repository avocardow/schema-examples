// item_images: Photos and media attachments associated with auction items.
// See README.md for full design rationale.

import { pgTable, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { items } from "./items";

export const itemImages = pgTable(
  "item_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    itemId: uuid("item_id").notNull().references(() => items.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    altText: text("alt_text"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_item_images_item_id").on(table.itemId),
  ]
);
