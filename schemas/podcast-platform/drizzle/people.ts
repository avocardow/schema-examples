// People who contribute to podcasts as hosts, guests, producers, etc.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { files } from "./files";

export const people = pgTable(
  "people",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").unique().notNull(),
    bio: text("bio"),
    url: text("url"),
    imageFileId: uuid("image_file_id").references(() => files.id, { onDelete: "set null" }),
    podcastIndexId: text("podcast_index_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_people_name").on(table.name),
  ]
);
