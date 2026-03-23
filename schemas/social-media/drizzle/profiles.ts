// profiles: Public-facing user profile with display info and social counters.
// See README.md for full design rationale.
import { pgTable, uuid, text, boolean, integer, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users";
import { files } from "./files";

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .unique()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    displayName: text("display_name"),
    bio: text("bio"),
    avatarFileId: uuid("avatar_file_id").references(() => files.id, { onDelete: "set null" }),
    bannerFileId: uuid("banner_file_id").references(() => files.id, { onDelete: "set null" }),
    website: text("website"),
    location: text("location"),
    isPrivate: boolean("is_private").notNull().default(false),
    followerCount: integer("follower_count").notNull().default(0),
    followingCount: integer("following_count").notNull().default(0),
    postCount: integer("post_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_profiles_is_private").on(table.isPrivate),
  ]
);
