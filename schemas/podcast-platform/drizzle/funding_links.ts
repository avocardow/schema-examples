// Funding and donation links associated with podcast shows
// See README.md for full design rationale.

import { pgTable, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { shows } from "./shows";

export const fundingLinks = pgTable(
  "funding_links",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    showId: uuid("show_id").notNull().references(() => shows.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    title: text("title").notNull(),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_funding_links_show_id_position").on(table.showId, table.position),
  ]
);
