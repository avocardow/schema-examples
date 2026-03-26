// compliance_tags: Reusable tags for categorizing compliance entities within an organization.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, unique } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";

export const complianceTags = pgTable(
  "compliance_tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").references(() => organizations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    color: text("color"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_compliance_tags_organization_id_name").on(table.organizationId, table.name),
  ]
);
