// playlists: User-created or editorial playlists of tracks.
// See README.md for full design rationale.

import { pgTable, uuid, text, boolean, integer, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users";
import { files } from "./files";

export const playlists = pgTable(
  "playlists",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: uuid("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    coverFileId: uuid("cover_file_id").references(() => files.id, { onDelete: "set null" }),
    isPublic: boolean("is_public").notNull().default(true),
    isCollaborative: boolean("is_collaborative").notNull().default(false),
    trackCount: integer("track_count").notNull().default(0),
    followerCount: integer("follower_count").notNull().default(0),
    totalDurationMs: integer("total_duration_ms").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_playlists_owner_id_created_at").on(table.ownerId, table.createdAt),
    index("idx_playlists_is_public_follower_count").on(table.isPublic, table.followerCount),
  ]
);
