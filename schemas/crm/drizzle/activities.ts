// activities: calls, emails, and meetings logged against contacts, companies, or deals.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { contacts } from "./contacts";
import { companies } from "./companies";
import { deals } from "./deals";
import { users } from "./users";

export const activityTypeEnum = pgEnum("activity_type", [
  "call",
  "email",
  "meeting",
]);

export const activities = pgTable(
  "activities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    type: activityTypeEnum("type").notNull(),
    subject: text("subject").notNull(),
    description: text("description"),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
    duration: integer("duration"),
    contactId: uuid("contact_id").references(() => contacts.id, { onDelete: "set null" }),
    companyId: uuid("company_id").references(() => companies.id, { onDelete: "set null" }),
    dealId: uuid("deal_id").references(() => deals.id, { onDelete: "set null" }),
    ownerId: uuid("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_activities_contact_occurred").on(table.contactId, table.occurredAt),
    index("idx_activities_company_occurred").on(table.companyId, table.occurredAt),
    index("idx_activities_deal_occurred").on(table.dealId, table.occurredAt),
    index("idx_activities_owner_id").on(table.ownerId),
    index("idx_activities_type").on(table.type),
  ]
);
