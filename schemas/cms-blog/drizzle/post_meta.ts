// post_meta: Extensible key-value metadata for posts.
// See README.md for full design rationale.
import { pgTable, uuid, text, unique, index } from "drizzle-orm/pg-core";
import { posts } from "./posts";

export const postMeta = pgTable("post_meta", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  metaKey: text("meta_key").notNull(),
  metaValue: text("meta_value"),
}, (table) => [
  unique("uq_post_meta_post_id_meta_key").on(table.postId, table.metaKey),
  index("idx_post_meta_meta_key").on(table.metaKey),
]);
