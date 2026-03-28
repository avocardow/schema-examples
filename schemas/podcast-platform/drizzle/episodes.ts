// Individual podcast episodes with media, metadata, and publishing info
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, boolean, integer, timestamp, index, unique } from "drizzle-orm/pg-core";
import { shows } from "./shows";
import { files } from "./files";

export const episodeTypeEnum = pgEnum("episode_type_enum", ["full", "trailer", "bonus"]);

export const episodes = pgTable(
  "episodes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    showId: uuid("show_id").notNull().references(() => shows.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    htmlDescription: text("html_description"),
    episodeType: episodeTypeEnum("episode_type").notNull().default("full"),
    seasonNumber: integer("season_number"),
    episodeNumber: integer("episode_number"),
    durationMs: integer("duration_ms").notNull().default(0),
    explicit: boolean("explicit").notNull().default(false),
    audioFileId: uuid("audio_file_id").references(() => files.id, { onDelete: "set null" }),
    artworkFileId: uuid("artwork_file_id").references(() => files.id, { onDelete: "set null" }),
    enclosureUrl: text("enclosure_url"),
    enclosureLength: integer("enclosure_length"),
    enclosureType: text("enclosure_type"),
    guid: text("guid"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    isBlocked: boolean("is_blocked").notNull().default(false),
    playCount: integer("play_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_episodes_show_id_slug").on(table.showId, table.slug),
    index("idx_episodes_show_id_published_at").on(table.showId, table.publishedAt),
    index("idx_episodes_show_id_season_number_episode_number").on(table.showId, table.seasonNumber, table.episodeNumber),
    index("idx_episodes_published_at").on(table.publishedAt),
    index("idx_episodes_guid").on(table.guid),
  ]
);
