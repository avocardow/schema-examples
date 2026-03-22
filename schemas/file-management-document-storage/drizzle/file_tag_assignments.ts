// file_tag_assignments: Many-to-many join between files and tags with audit trail.
// See README.md for full design rationale.

import { pgTable, uuid, timestamp, index, unique } from "drizzle-orm/pg-core";
import { files } from "./files";
import { fileTags } from "./file_tags";
import { users } from "../../auth-rbac/drizzle/users";

export const fileTagAssignments = pgTable(
  "file_tag_assignments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fileId: uuid("file_id")
      .notNull()
      .references(() => files.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => fileTags.id, { onDelete: "cascade" }),
    taggedBy: uuid("tagged_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique("uq_file_tag_assignments_file_tag").on(table.fileId, table.tagId),
    index("idx_file_tag_assignments_tag_id").on(table.tagId),
    index("idx_file_tag_assignments_tagged_by").on(table.taggedBy),
  ]
);
