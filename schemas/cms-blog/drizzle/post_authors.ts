// post_authors: Links posts to authors with role and display ordering.
// See README.md for full design rationale.
import { pgTable, pgEnum, uuid, integer, unique, index } from "drizzle-orm/pg-core";
import { posts } from "./posts";
import { authors } from "./authors";

export const postAuthorRoleEnum = pgEnum("post_author_role", ["author", "contributor", "editor", "guest"]);

export const postAuthors = pgTable("post_authors", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  authorId: uuid("author_id").notNull().references(() => authors.id, { onDelete: "cascade" }),
  sortOrder: integer("sort_order").notNull().default(0),
  role: postAuthorRoleEnum("role").notNull().default("author"),
}, (table) => [
  unique("uq_post_authors_post_id_author_id").on(table.postId, table.authorId),
  index("idx_post_authors_author_id").on(table.authorId),
]);
