// Podcast shows / feeds with metadata, ownership, and network association
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, boolean, integer, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users";
import { networks } from "./networks";
import { files } from "./files";

export const showTypeEnum = pgEnum("show_type_enum", ["episodic", "serial"]);

export const showMediumEnum = pgEnum("show_medium_enum", ["podcast", "music", "video", "audiobook", "newsletter"]);

export const shows = pgTable(
  "shows",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: uuid("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    networkId: uuid("network_id").references(() => networks.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    slug: text("slug").unique().notNull(),
    description: text("description").notNull(),
    htmlDescription: text("html_description"),
    author: text("author").notNull(),
    language: text("language").notNull().default("en"),
    showType: showTypeEnum("show_type").notNull().default("episodic"),
    explicit: boolean("explicit").notNull().default(false),
    artworkFileId: uuid("artwork_file_id").references(() => files.id, { onDelete: "set null" }),
    bannerFileId: uuid("banner_file_id").references(() => files.id, { onDelete: "set null" }),
    feedUrl: text("feed_url"),
    website: text("website"),
    copyright: text("copyright"),
    ownerName: text("owner_name"),
    ownerEmail: text("owner_email"),
    podcastGuid: text("podcast_guid"),
    medium: showMediumEnum("medium").notNull().default("podcast"),
    isComplete: boolean("is_complete").notNull().default(false),
    episodeCount: integer("episode_count").notNull().default(0),
    subscriberCount: integer("subscriber_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_shows_owner_id").on(table.ownerId),
    index("idx_shows_network_id").on(table.networkId),
    index("idx_shows_language_show_type").on(table.language, table.showType),
    index("idx_shows_subscriber_count").on(table.subscriberCount),
  ]
);
