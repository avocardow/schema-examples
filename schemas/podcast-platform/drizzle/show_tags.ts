// Free-form tags associated with podcast shows for discovery
// See README.md for full design rationale.

import { pgTable, uuid, text, unique, index } from "drizzle-orm/pg-core";
import { shows } from "./shows";

export const showTags = pgTable(
  "show_tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    showId: uuid("show_id").notNull().references(() => shows.id, { onDelete: "cascade" }),
    tag: text("tag").notNull(),
  },
  (table) => [
    unique("uq_show_tags_show_id_tag").on(table.showId, table.tag),
    index("idx_show_tags_tag").on(table.tag),
  ]
);
