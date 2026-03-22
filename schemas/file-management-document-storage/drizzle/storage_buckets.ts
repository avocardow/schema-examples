// storage_buckets: Logical containers for files with per-bucket configuration and upload constraints.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  boolean,
  bigint,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";

export const storageBuckets = pgTable(
  "storage_buckets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").unique().notNull(), // Human-readable bucket name. Used in API paths (e.g., /storage/avatars/).
    description: text("description"), // Explain what this bucket is for.

    // Controls anonymous read access to files in this bucket.
    // false = all access requires authentication.
    // true = files are publicly readable (e.g., CDN-served assets).
    isPublic: boolean("is_public").notNull().default(false),

    allowedMimeTypes: text("allowed_mime_types").array(), // Whitelist of accepted MIME types. Null = all types allowed.
    maxFileSize: bigint("max_file_size", { mode: "number" }), // Maximum file size in bytes. Null = no limit.

    // Whether files in this bucket track version history.
    versioningEnabled: boolean("versioning_enabled").notNull().default(false),

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
  }
);
