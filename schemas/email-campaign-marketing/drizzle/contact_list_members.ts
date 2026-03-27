// contact_list_members: Tracks which contacts belong to which lists with subscription state.
// See README.md for full design rationale.

import { pgTable, uuid, timestamp, index, unique, pgEnum } from "drizzle-orm/pg-core";
import { contacts } from "./contacts";
import { contactLists } from "./contact_lists";

export const subscriptionStatus = pgEnum("subscription_status", [
  "subscribed",
  "unsubscribed",
  "unconfirmed",
]);

export const contactListMembers = pgTable(
  "contact_list_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contactId: uuid("contact_id").notNull().references(() => contacts.id, { onDelete: "cascade" }),
    listId: uuid("list_id").notNull().references(() => contactLists.id, { onDelete: "cascade" }),
    status: subscriptionStatus("status").notNull().default("subscribed"),
    subscribedAt: timestamp("subscribed_at", { withTimezone: true }),
    unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_contact_list_members_contact_list").on(table.contactId, table.listId),
    index("idx_contact_list_members_list_status").on(table.listId, table.status),
  ],
);
