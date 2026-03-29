// folders: Hierarchical directory structure for organizing assets within workspaces.
// See README.md for full design rationale.

import { pgTable, uuid, text, integer, timestamp, index, unique } from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";
import { workspaces } from "./workspaces";

export const folders = pgTable(
  "folders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    parentId: uuid("parent_id").references(() => folders.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    path: text("path").notNull(),
    depth: integer("depth").notNull().default(0),
    description: text("description"),
    createdBy: uuid("created_by").notNull().references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_folders_workspace_id_path").on(table.workspaceId, table.path),
    unique("uq_folders_workspace_id_parent_id_name").on(table.workspaceId, table.parentId, table.name),
    index("idx_folders_parent_id").on(table.parentId),
    index("idx_folders_workspace_id_depth").on(table.workspaceId, table.depth),
  ]
);
