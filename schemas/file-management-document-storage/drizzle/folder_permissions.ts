// folder_permissions: Per-user permission grants on folders, with optional inheritance tracking.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  boolean,
  timestamp,
  unique,
  index,
} from "drizzle-orm/pg-core";
import { folders } from "./folders";

export const folderPermissionLevel = pgEnum("folder_permission_level", [
  "view",
  "edit",
  "manage",
]);

export const folderPermissions = pgTable(
  "folder_permissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    folderId: uuid("folder_id")
      .notNull()
      .references(() => folders.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull(),
    permission: folderPermissionLevel("permission").notNull().default("view"),
    inherited: boolean("inherited").notNull().default(false),
    grantedBy: uuid("granted_by"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    unique("uq_folder_permissions_folder_user").on(
      table.folderId,
      table.userId
    ),
    index("idx_folder_permissions_user_id").on(table.userId),
    index("idx_folder_permissions_folder_id").on(table.folderId),
  ]
);
