// share_links: Tokenized shareable links for assets and collections with access controls.
// See README.md for full design rationale.

import { pgTable, uuid, text, boolean, integer, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";
import { workspaces } from "./workspaces";
import { assets } from "./assets";
import { collections } from "./collections";

export const shareLinks = pgTable(
  "share_links",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    assetId: uuid("asset_id").references(() => assets.id, { onDelete: "cascade" }),
    collectionId: uuid("collection_id").references(() => collections.id, { onDelete: "cascade" }),
    token: text("token").unique().notNull(),
    passwordHash: text("password_hash"),
    allowDownload: boolean("allow_download").notNull().default(true),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    viewCount: integer("view_count").notNull().default(0),
    maxViews: integer("max_views"),
    createdBy: uuid("created_by").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_share_links_workspace_id").on(table.workspaceId),
    index("idx_share_links_asset_id").on(table.assetId),
    index("idx_share_links_collection_id").on(table.collectionId),
    index("idx_share_links_expires_at").on(table.expiresAt),
  ]
);
