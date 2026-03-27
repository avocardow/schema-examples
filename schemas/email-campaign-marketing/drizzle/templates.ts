// templates: Reusable email templates with HTML and text bodies.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const templates = pgTable(
  "templates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    subject: text("subject"),
    htmlBody: text("html_body"),
    textBody: text("text_body"),
    fromName: text("from_name"),
    fromEmail: text("from_email"),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_templates_created_by").on(table.createdBy),
  ],
);
