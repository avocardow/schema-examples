// User-created playlists for organizing episodes manually or via smart filters
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, boolean, integer, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const playlistTypeEnum = pgEnum("playlist_type_enum", ["manual", "smart"]);

export const playlists = pgTable(
  "playlists",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    playlistType: playlistTypeEnum("playlist_type").notNull().default("manual"),
    smartFilters: jsonb("smart_filters"),
    isPublic: boolean("is_public").notNull().default(false),
    episodeCount: integer("episode_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_playlists_user_id_created_at").on(table.userId, table.createdAt),
  ]
);
