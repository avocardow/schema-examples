// licenses: Defines reusable license templates for rights management.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, integer, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";
import { workspaces } from "./workspaces";

export const licenseTypeEnum = pgEnum("license_type", [
  "royalty_free",
  "rights_managed",
  "editorial",
  "creative_commons",
  "internal",
  "custom",
]);

export const licenses = pgTable(
  "licenses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    licenseType: licenseTypeEnum("license_type").notNull(),
    territories: jsonb("territories"),
    channels: jsonb("channels"),
    maxUses: integer("max_uses"),
    createdBy: uuid("created_by").notNull().references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_licenses_workspace_id").on(table.workspaceId),
    index("idx_licenses_license_type").on(table.licenseType),
  ]
);
