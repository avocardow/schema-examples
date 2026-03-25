// ticket_tags: many-to-many association between tickets and tags.
// See README.md for full design rationale.

import { pgTable, uuid, timestamp, index, uniqueIndex } from "drizzle-orm/pg-core";
import { tickets } from "./tickets";
import { tags } from "./tags";

export const ticketTags = pgTable(
  "ticket_tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ticketId: uuid("ticket_id").notNull().references(() => tickets.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("uq_ticket_tags_ticket_id_tag_id").on(table.ticketId, table.tagId),
    index("idx_ticket_tags_tag_id").on(table.tagId),
  ]
);
