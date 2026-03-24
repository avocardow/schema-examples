// leads: inbound prospects before conversion to contacts.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { contacts } from "./contacts";
import { leadSourceEnum } from "./contacts";
import { users } from "./users";

export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "contacted",
  "qualified",
  "unqualified",
  "converted",
]);

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email").notNull().unique(),
    phone: text("phone"),
    companyName: text("company_name"),
    title: text("title"),
    source: leadSourceEnum("source"),
    status: leadStatusEnum("status").notNull().default("new"),
    convertedAt: timestamp("converted_at", { withTimezone: true }),
    convertedContactId: uuid("converted_contact_id").references(() => contacts.id, { onDelete: "set null" }),
    ownerId: uuid("owner_id").references(() => users.id, { onDelete: "set null" }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_leads_status").on(table.status),
    index("idx_leads_owner_id").on(table.ownerId),
    index("idx_leads_source").on(table.source),
  ]
);
