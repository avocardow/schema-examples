// contact_tag_assignments: Many-to-many join between contacts and tags.
// See README.md for full design rationale.

import { pgTable, uuid, timestamp, index, unique } from "drizzle-orm/pg-core";
import { contacts } from "./contacts";
import { tags } from "./tags";

export const contactTagAssignments = pgTable(
  "contact_tag_assignments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contactId: uuid("contact_id").notNull().references(() => contacts.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_contact_tag_assignments_contact_tag").on(table.contactId, table.tagId),
    index("idx_contact_tag_assignments_tag_id").on(table.tagId),
  ],
);
