// notes: free-text notes attached to contacts, companies, deals, or leads.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { contacts } from "./contacts";
import { companies } from "./companies";
import { deals } from "./deals";
import { leads } from "./leads";
import { users } from "./users";

export const notes = pgTable(
  "notes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    content: text("content").notNull(),
    contactId: uuid("contact_id").references(() => contacts.id, { onDelete: "cascade" }),
    companyId: uuid("company_id").references(() => companies.id, { onDelete: "cascade" }),
    dealId: uuid("deal_id").references(() => deals.id, { onDelete: "cascade" }),
    leadId: uuid("lead_id").references(() => leads.id, { onDelete: "cascade" }),
    createdBy: uuid("created_by").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_notes_contact_id").on(table.contactId),
    index("idx_notes_company_id").on(table.companyId),
    index("idx_notes_deal_id").on(table.dealId),
    index("idx_notes_lead_id").on(table.leadId),
    index("idx_notes_created_by").on(table.createdBy),
  ]
);
