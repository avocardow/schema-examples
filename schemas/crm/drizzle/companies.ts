// companies: organizations tracked in the CRM with industry and revenue data.
// See README.md for full design rationale.

import { pgTable, uuid, text, integer, numeric, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const companies = pgTable(
  "companies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    domain: text("domain").unique(),
    industry: text("industry"),
    employeeCount: integer("employee_count"),
    annualRevenue: numeric("annual_revenue"),
    phone: text("phone"),
    addressStreet: text("address_street"),
    addressCity: text("address_city"),
    addressState: text("address_state"),
    addressCountry: text("address_country"),
    addressZip: text("address_zip"),
    website: text("website"),
    description: text("description"),
    ownerId: uuid("owner_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_companies_owner_id").on(table.ownerId),
    index("idx_companies_industry").on(table.industry),
  ]
);
