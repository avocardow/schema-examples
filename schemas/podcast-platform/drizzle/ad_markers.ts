// Ad insertion markers within podcast episodes for dynamic ad placement
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, integer, timestamp, index } from "drizzle-orm/pg-core";
import { episodes } from "./episodes";

export const adMarkerTypeEnum = pgEnum("ad_marker_type", ["preroll", "midroll", "postroll"]);

export const adMarkers = pgTable(
  "ad_markers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    episodeId: uuid("episode_id").notNull().references(() => episodes.id, { onDelete: "cascade" }),
    markerType: adMarkerTypeEnum("marker_type").notNull(),
    positionMs: integer("position_ms"),
    durationMs: integer("duration_ms"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_ad_markers_episode_id_marker_type").on(table.episodeId, table.markerType),
  ]
);
