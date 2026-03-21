// teams: Sub-groups within an organization (e.g., "Engineering", "Marketing").
// Lighter than nested orgs — no billing, SSO, or domain verification.
// See README.md for full design rationale and field documentation.

import { pgTable, uuid, text, timestamp, index, unique } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";

export const teams = pgTable(
  "teams",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),

    name: text("name").notNull(), // Display name (e.g., "Engineering").
    slug: text("slug").notNull(), // URL-safe identifier, unique within the org (e.g., "engineering").

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("teams_organization_id_slug_unique").on(table.organizationId, table.slug), // Slugs must be unique within each org, not globally.
    index("idx_teams_organization_id").on(table.organizationId), // "List all teams in this org."
  ]
);
