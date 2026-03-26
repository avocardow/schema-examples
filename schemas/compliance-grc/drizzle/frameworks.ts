// frameworks: Regulatory and compliance frameworks adopted by an organization.
// See README.md for full design rationale.

import { pgTable, uuid, text, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";

export const frameworks = pgTable(
  "frameworks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").references(() => organizations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    version: text("version"),
    authority: text("authority"),
    description: text("description"),
    websiteUrl: text("website_url"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_frameworks_organization_id").on(table.organizationId),
    index("idx_frameworks_is_active").on(table.isActive),
  ]
);
