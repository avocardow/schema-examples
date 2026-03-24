// contact_companies: junction table linking contacts to companies with role info.
// See README.md for full design rationale.

import { pgTable, uuid, text, boolean, timestamp, index, unique } from "drizzle-orm/pg-core";
import { contacts } from "./contacts";
import { companies } from "./companies";

export const contactCompanies = pgTable(
  "contact_companies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contactId: uuid("contact_id").notNull().references(() => contacts.id, { onDelete: "cascade" }),
    companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    role: text("role"),
    isPrimary: boolean("is_primary").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_contact_companies").on(table.contactId, table.companyId),
    index("idx_contact_companies_company_id").on(table.companyId),
  ]
);
