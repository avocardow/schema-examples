// post_hashtags: Many-to-many link between posts and hashtags.
// See README.md for full design rationale.
import { pgTable, uuid, timestamp, index, unique } from "drizzle-orm/pg-core";
import { posts } from "./posts";
import { hashtags } from "./hashtags";

export const postHashtags = pgTable(
  "post_hashtags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    hashtagId: uuid("hashtag_id")
      .notNull()
      .references(() => hashtags.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_post_hashtags_post_hashtag").on(table.postId, table.hashtagId),
    index("idx_post_hashtags_hashtag_id_created_at").on(table.hashtagId, table.createdAt),
  ]
);
