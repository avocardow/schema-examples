// contacts: people tracked in the CRM with lifecycle stage and source attribution.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const contactLifecycleStageEnum = pgEnum("contact_lifecycle_stage", [
  "subscriber",
  "lead",
  "qualified",
  "opportunity",
  "customer",
  "evangelist",
  "other",
]);

export const leadSourceEnum = pgEnum("lead_source", [
  "web",
  "referral",
  "organic",
  "paid",
  "social",
  "event",
  "cold_outreach",
  "other",
]);

export const contacts = pgTable(
  "contacts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email").notNull().unique(),
    phone: text("phone"),
    title: text("title"),
    lifecycleStage: contactLifecycleStageEnum("lifecycle_stage").notNull().default("lead"),
    source: leadSourceEnum("source"),
    ownerId: uuid("owner_id").references(() => users.id, { onDelete: "set null" }),
    avatarUrl: text("avatar_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_contacts_owner_id").on(table.ownerId),
    index("idx_contacts_lifecycle_stage").on(table.lifecycleStage),
  ]
);
