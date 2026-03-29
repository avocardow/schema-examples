// tags: Workspace-scoped labels for categorizing and searching assets.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, unique } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";

export const tags = pgTable(
  "tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_tags_workspace_id_name").on(table.workspaceId, table.name),
  ]
);
