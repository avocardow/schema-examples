// asset_tags: Join table associating tags with assets.
// See README.md for full design rationale.

import { pgTable, uuid, timestamp, index, unique } from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";
import { assets } from "./assets";
import { tags } from "./tags";

export const assetTags = pgTable(
  "asset_tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    assetId: uuid("asset_id").notNull().references(() => assets.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }),
    assignedBy: uuid("assigned_by").notNull().references(() => users.id, { onDelete: "restrict" }),
    assignedAt: timestamp("assigned_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_asset_tags_asset_id_tag_id").on(table.assetId, table.tagId),
    index("idx_asset_tags_tag_id").on(table.tagId),
  ]
);
