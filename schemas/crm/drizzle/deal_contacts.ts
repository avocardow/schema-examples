// deal_contacts: junction table linking deals to contacts with stakeholder roles.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, timestamp, index, unique } from "drizzle-orm/pg-core";
import { deals } from "./deals";
import { contacts } from "./contacts";

export const dealContactRoleEnum = pgEnum("deal_contact_role", [
  "decision_maker",
  "champion",
  "influencer",
  "end_user",
  "other",
]);

export const dealContacts = pgTable(
  "deal_contacts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    dealId: uuid("deal_id").notNull().references(() => deals.id, { onDelete: "cascade" }),
    contactId: uuid("contact_id").notNull().references(() => contacts.id, { onDelete: "cascade" }),
    role: dealContactRoleEnum("role").notNull().default("other"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_deal_contacts").on(table.dealId, table.contactId),
    index("idx_deal_contacts_contact_id").on(table.contactId),
  ]
);
