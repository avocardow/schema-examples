// collection_assets: Join table linking assets to collections with ordering.
// See README.md for full design rationale.

import { pgTable, uuid, integer, timestamp, index, unique } from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";
import { collections } from "./collections";
import { assets } from "./assets";

export const collectionAssets = pgTable(
  "collection_assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    collectionId: uuid("collection_id").notNull().references(() => collections.id, { onDelete: "cascade" }),
    assetId: uuid("asset_id").notNull().references(() => assets.id, { onDelete: "cascade" }),
    position: integer("position").notNull().default(0),
    addedBy: uuid("added_by").notNull().references(() => users.id, { onDelete: "restrict" }),
    addedAt: timestamp("added_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_collection_assets_collection_id_asset_id").on(table.collectionId, table.assetId),
    index("idx_collection_assets_asset_id").on(table.assetId),
  ]
);
