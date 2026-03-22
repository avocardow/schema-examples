// file_activities: Audit trail for file and folder operations. Append-only — rows are never updated or deleted.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";

export const fileActivityAction = pgEnum("file_activity_action", [
  "created",
  "uploaded",
  "updated",
  "renamed",
  "moved",
  "copied",
  "deleted",
  "restored",
  "shared",
  "unshared",
  "downloaded",
  "locked",
  "unlocked",
  "commented",
  "version_created",
]);

export const fileActivityTargetType = pgEnum("file_activity_target_type", [
  "file",
  "folder",
]);

export const fileActivities = pgTable(
  "file_activities",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    actorId: uuid("actor_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),

    action: fileActivityAction("action").notNull(),

    targetType: fileActivityTargetType("target_type").notNull(), // Whether the action was on a file or folder.
    targetId: uuid("target_id").notNull(), // The file or folder ID. Not a FK — target may be permanently deleted.
    targetName: text("target_name").notNull(), // Denormalized: file/folder name at the time of the action.

    details: jsonb("details"), // Action-specific context (e.g., moved: {from_folder_id, to_folder_id}).
    ipAddress: text("ip_address"), // Client IP address for security audit.

    // Immutable. Activities are append-only — no updated_at.
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_file_activities_actor_id").on(table.actorId),
    index("idx_file_activities_target").on(table.targetType, table.targetId),
    index("idx_file_activities_action").on(table.action),
    index("idx_file_activities_created_at").on(table.createdAt),
  ]
);
