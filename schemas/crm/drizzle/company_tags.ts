// company_tags: junction table linking companies to tags.
// See README.md for full design rationale.

import { pgTable, uuid, timestamp, index, unique } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { tags } from "./tags";

export const companyTags = pgTable(
  "company_tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_company_tags").on(table.companyId, table.tagId),
    index("idx_company_tags_tag_id").on(table.tagId),
  ]
);
