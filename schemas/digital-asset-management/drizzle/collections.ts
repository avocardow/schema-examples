// collections: Curated groups of assets for organization and sharing.
// See README.md for full design rationale.

import { pgTable, uuid, text, boolean, integer, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";
import { workspaces } from "./workspaces";
import { assets } from "./assets";

export const collections = pgTable(
  "collections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    coverAssetId: uuid("cover_asset_id").references(() => assets.id, { onDelete: "set null" }),
    isPublic: boolean("is_public").notNull().default(false),
    assetCount: integer("asset_count").notNull().default(0),
    createdBy: uuid("created_by").notNull().references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_collections_workspace_id").on(table.workspaceId),
    index("idx_collections_created_by").on(table.createdBy),
  ]
);
