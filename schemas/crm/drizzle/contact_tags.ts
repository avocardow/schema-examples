// contact_tags: junction table linking contacts to tags.
// See README.md for full design rationale.

import { pgTable, uuid, timestamp, index, unique } from "drizzle-orm/pg-core";
import { contacts } from "./contacts";
import { tags } from "./tags";

export const contactTags = pgTable(
  "contact_tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contactId: uuid("contact_id").notNull().references(() => contacts.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_contact_tags").on(table.contactId, table.tagId),
    index("idx_contact_tags_tag_id").on(table.tagId),
  ]
);
