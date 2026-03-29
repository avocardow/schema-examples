// comments: Threaded discussions on assets for collaboration and feedback.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";
import { assets } from "./assets";

export const comments = pgTable(
  "comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    assetId: uuid("asset_id").notNull().references(() => assets.id, { onDelete: "cascade" }),
    parentId: uuid("parent_id").references(() => comments.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    authorId: uuid("author_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_comments_asset_id").on(table.assetId),
    index("idx_comments_parent_id").on(table.parentId),
  ]
);
