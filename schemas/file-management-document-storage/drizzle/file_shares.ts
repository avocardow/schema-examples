// file_shares: Direct access grants to specific users, groups, or organizations.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { files } from "./files";
import { folders } from "./folders";
import { users } from "../../auth-rbac/drizzle/users";

export const fileShareTargetType = pgEnum("file_share_target_type", [
  "file",
  "folder",
]);

export const fileShareSharedWithType = pgEnum("file_share_shared_with_type", [
  "user",
  "group",
  "organization",
]);

export const fileShareRole = pgEnum("file_share_role", [
  "viewer",
  "commenter",
  "editor",
  "co_owner",
]);

export const fileShares = pgTable(
  "file_shares",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // What is being shared. Exactly one of targetFileId or targetFolderId must be set.
    targetType: fileShareTargetType("target_type").notNull(), // Discriminator for which FK is populated.
    targetFileId: uuid("target_file_id").references(() => files.id, {
      onDelete: "cascade",
    }), // Populated when targetType = 'file'.
    targetFolderId: uuid("target_folder_id").references(() => folders.id, {
      onDelete: "cascade",
    }), // Populated when targetType = 'folder'.

    sharedBy: uuid("shared_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }), // Who created this share.

    // Who the share is granted to. Target depends on sharedWithType.
    sharedWithType: fileShareSharedWithType("shared_with_type").notNull(),
    sharedWithId: uuid("shared_with_id").notNull(), // Polymorphic — not a FK.

    role: fileShareRole("role").notNull(),
    allowReshare: boolean("allow_reshare").notNull().default(false), // Whether the recipient can share this item with others.
    expiresAt: timestamp("expires_at", { withTimezone: true }), // Null = never expires.
    acceptedAt: timestamp("accepted_at", { withTimezone: true }), // Null = pending acceptance.
    message: text("message"), // Optional message to the recipient.

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_file_shares_target_file").on(table.targetType, table.targetFileId),
    index("idx_file_shares_target_folder").on(table.targetType, table.targetFolderId),
    index("idx_file_shares_shared_with").on(table.sharedWithType, table.sharedWithId),
    index("idx_file_shares_shared_by").on(table.sharedBy),
    index("idx_file_shares_expires_at").on(table.expiresAt),
  ]
);
