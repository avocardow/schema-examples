// post_media: Media attachments (images, videos, GIFs) linked to posts.
// See README.md for full design rationale.
import { pgTable, pgEnum, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { posts } from "./posts";
import { files } from "./files";

export const mediaTypeEnum = pgEnum("media_type", ["image", "video", "gif"]);

export const postMedia = pgTable(
  "post_media",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    fileId: uuid("file_id")
      .notNull()
      .references(() => files.id, { onDelete: "restrict" }),
    mediaType: mediaTypeEnum("media_type").notNull(),
    width: integer("width"),
    height: integer("height"),
    altText: text("alt_text"),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_post_media_post_id_position").on(table.postId, table.position),
    index("idx_post_media_file_id").on(table.fileId),
  ]
);
