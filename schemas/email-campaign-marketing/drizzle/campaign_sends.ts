// campaign_sends: Tracks individual email send attempts per contact per campaign.
// See README.md for full design rationale.

import { pgTable, uuid, timestamp, index, unique, pgEnum } from "drizzle-orm/pg-core";
import { campaigns } from "./campaigns";
import { contacts } from "./contacts";

export const sendStatus = pgEnum("send_status", [
  "queued",
  "sent",
  "delivered",
  "bounced",
  "dropped",
  "deferred",
]);

export const campaignSends = pgTable(
  "campaign_sends",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    campaignId: uuid("campaign_id").notNull().references(() => campaigns.id, { onDelete: "cascade" }),
    contactId: uuid("contact_id").notNull().references(() => contacts.id, { onDelete: "cascade" }),
    status: sendStatus("status").notNull().default("queued"),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    deliveredAt: timestamp("delivered_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_campaign_sends_campaign_contact").on(table.campaignId, table.contactId),
    index("idx_campaign_sends_contact_id").on(table.contactId),
    index("idx_campaign_sends_status").on(table.status),
    index("idx_campaign_sends_sent_at").on(table.sentAt),
  ],
);
