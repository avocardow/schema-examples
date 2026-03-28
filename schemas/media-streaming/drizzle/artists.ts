// artists: Musicians and bands available on the platform.
// See README.md for full design rationale.

import { pgTable, uuid, text, boolean, integer, timestamp, index } from "drizzle-orm/pg-core";
import { files } from "./files";

export const artists = pgTable(
  "artists",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").unique().notNull(),
    bio: text("bio"),
    imageFileId: uuid("image_file_id").references(() => files.id, { onDelete: "set null" }),
    bannerFileId: uuid("banner_file_id").references(() => files.id, { onDelete: "set null" }),
    isVerified: boolean("is_verified").notNull().default(false),
    followerCount: integer("follower_count").notNull().default(0),
    monthlyListeners: integer("monthly_listeners").notNull().default(0),
    popularity: integer("popularity").notNull().default(0),
    externalUrl: text("external_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_artists_popularity").on(table.popularity),
    index("idx_artists_name").on(table.name),
  ]
);
