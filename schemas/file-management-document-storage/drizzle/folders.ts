// folders: Folder tree with materialized path for efficient subtree queries.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "../../auth-rbac/drizzle/users";
import { storageBuckets } from "./storage_buckets";

export const folders = pgTable(
  "folders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bucketId: uuid("bucket_id")
      .notNull()
      .references(() => storageBuckets.id, { onDelete: "cascade" }),
    parentId: uuid("parent_id").references(() => folders.id, {
      onDelete: "cascade",
    }), // Null = root-level folder within the bucket.
    name: text("name").notNull(), // Display name (e.g., "Documents", "Photos 2024").

    // Materialized path using folder IDs as segments.
    // Uses UUIDs (not names) so folder renames don't cascade path updates.
    path: text("path").notNull(),

    depth: integer("depth").notNull().default(0), // Hierarchy level. 0 = root, 1 = child of root, etc.
    description: text("description"),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    uniqueIndex("idx_folders_bucket_id_path").on(table.bucketId, table.path),
    uniqueIndex("idx_folders_bucket_id_parent_id_name").on(
      table.bucketId,
      table.parentId,
      table.name
    ),
    uniqueIndex("idx_folders_bucket_id_name_root")
      .on(table.bucketId, table.name)
      .where(sql`parent_id IS NULL`),
    index("idx_folders_parent_id").on(table.parentId),
    index("idx_folders_bucket_id_depth").on(table.bucketId, table.depth),
  ]
);
