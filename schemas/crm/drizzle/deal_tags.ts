// deal_tags: junction table linking deals to tags.
// See README.md for full design rationale.

import { pgTable, uuid, timestamp, index, unique } from "drizzle-orm/pg-core";
import { deals } from "./deals";
import { tags } from "./tags";

export const dealTags = pgTable(
  "deal_tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    dealId: uuid("deal_id").notNull().references(() => deals.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_deal_tags").on(table.dealId, table.tagId),
    index("idx_deal_tags_tag_id").on(table.tagId),
  ]
);
