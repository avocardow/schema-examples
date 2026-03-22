// file_shortcuts: Cross-folder references without file duplication — similar to Google Drive shortcuts.
// See README.md for full design rationale.

import { pgEnum, pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { folders } from "./folders";
import { files } from "./files";
import { users } from "../../auth-rbac/drizzle/users";

export const fileShortcutTargetType = pgEnum("file_shortcut_target_type", [
  "file",
  "folder",
]);

export const fileShortcuts = pgTable(
  "file_shortcuts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    folderId: uuid("folder_id")
      .notNull()
      .references(() => folders.id, { onDelete: "cascade" }),

    // What the shortcut points to. Exactly one of targetFileId or targetFolderId must be set.
    targetType: fileShortcutTargetType("target_type").notNull(), // Discriminator for which FK is populated.
    targetFileId: uuid("target_file_id").references(() => files.id, {
      onDelete: "cascade",
    }), // Populated when targetType = 'file'.
    targetFolderId: uuid("target_folder_id").references(() => folders.id, {
      onDelete: "cascade",
    }), // Populated when targetType = 'folder'.

    name: text("name"), // Override display name. Null = use the target's name.
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_file_shortcuts_folder_id").on(table.folderId),
    index("idx_file_shortcuts_target_file_id").on(table.targetFileId),
    index("idx_file_shortcuts_target_folder_id").on(table.targetFolderId),
  ]
);
