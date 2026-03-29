// workspaces: Top-level organizational containers for digital assets.
// See README.md for full design rationale.

import { pgTable, uuid, text, bigint, timestamp } from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";

export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  description: text("description"),
  logoUrl: text("logo_url"),
  storageLimitBytes: bigint("storage_limit_bytes", { mode: "number" }),
  storageUsedBytes: bigint("storage_used_bytes", { mode: "number" }).notNull().default(0),
  createdBy: uuid("created_by").notNull().references(() => users.id, { onDelete: "restrict" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
