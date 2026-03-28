// Seasons within a podcast show for organizing episodes
// See README.md for full design rationale.

import { pgTable, uuid, text, integer, unique } from "drizzle-orm/pg-core";
import { shows } from "./shows";
import { files } from "./files";

export const seasons = pgTable(
  "seasons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    showId: uuid("show_id").notNull().references(() => shows.id, { onDelete: "cascade" }),
    seasonNumber: integer("season_number").notNull(),
    name: text("name"),
    description: text("description"),
    artworkFileId: uuid("artwork_file_id").references(() => files.id, { onDelete: "set null" }),
  },
  (table) => [
    unique("uq_seasons_show_id_season_number").on(table.showId, table.seasonNumber),
  ]
);
