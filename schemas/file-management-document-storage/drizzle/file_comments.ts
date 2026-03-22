// file_comments: Threaded comments on files — supports nested replies via parent_id self-reference and resolved state for review workflows.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  index,
  AnyPgColumn,
} from "drizzle-orm/pg-core";
import { files } from "./files";
import { users } from "../../auth-rbac/drizzle/users";

export const fileComments = pgTable(
  "file_comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fileId: uuid("file_id")
      .notNull()
      .references(() => files.id, { onDelete: "cascade" }),
    parentId: uuid("parent_id").references(
      (): AnyPgColumn => fileComments.id,
      { onDelete: "cascade" }
    ), // Parent comment for threaded replies. Null = top-level comment.
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    body: text("body").notNull(), // Comment text. Supports plain text or markdown.
    isResolved: boolean("is_resolved").notNull().default(false), // Whether this comment thread is resolved.
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_file_comments_file_id_created_at").on(table.fileId, table.createdAt),
    index("idx_file_comments_parent_id").on(table.parentId),
    index("idx_file_comments_author_id").on(table.authorId),
  ]
);
