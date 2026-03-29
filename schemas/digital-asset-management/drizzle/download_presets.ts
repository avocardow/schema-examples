// download_presets: Configurable output format presets for asset downloads.
// See README.md for full design rationale.

import { pgTable, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";
import { workspaces } from "./workspaces";

export const downloadPresets = pgTable(
  "download_presets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    outputFormat: text("output_format"),
    maxWidth: integer("max_width"),
    maxHeight: integer("max_height"),
    quality: integer("quality"),
    dpi: integer("dpi"),
    createdBy: uuid("created_by").notNull().references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_download_presets_workspace_id").on(table.workspaceId),
  ]
);
