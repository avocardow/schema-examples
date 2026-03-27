// contacts: Stores email marketing contacts with subscription status.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, index, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users";

export const contactStatus = pgEnum("contact_status", [
  "active",
  "unsubscribed",
  "bounced",
  "complained",
]);

export const contacts = pgTable(
  "contacts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").unique().notNull(),
    firstName: text("first_name"),
    lastName: text("last_name"),
    status: contactStatus("status").notNull().default("active"),
    metadata: jsonb("metadata").default(sql`'{}'`),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_contacts_status").on(table.status),
    index("idx_contacts_created_at").on(table.createdAt),
  ],
);
