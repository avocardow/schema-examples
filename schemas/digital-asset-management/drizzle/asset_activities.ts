// asset_activities: Audit log of all significant actions performed on assets.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";
import { workspaces } from "./workspaces";
import { assets } from "./assets";

export const assetActivityActionEnum = pgEnum("asset_activity_action", [
  "uploaded",
  "updated",
  "downloaded",
  "shared",
  "commented",
  "tagged",
  "moved",
  "versioned",
  "archived",
  "restored",
  "deleted",
]);

export const assetActivities = pgTable(
  "asset_activities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    assetId: uuid("asset_id").references(() => assets.id, { onDelete: "set null" }),
    actorId: uuid("actor_id").notNull().references(() => users.id, { onDelete: "restrict" }),
    action: assetActivityActionEnum("action").notNull(),
    details: jsonb("details"),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_asset_activities_workspace_id").on(table.workspaceId),
    index("idx_asset_activities_asset_id").on(table.assetId),
    index("idx_asset_activities_actor_id").on(table.actorId),
    index("idx_asset_activities_action").on(table.action),
    index("idx_asset_activities_occurred_at").on(table.occurredAt),
  ]
);
