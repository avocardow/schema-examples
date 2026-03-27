// campaign_events: Records engagement events (opens, clicks, bounces) for campaign sends.
// See README.md for full design rationale.

import { pgTable, uuid, timestamp, index, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { campaignSends } from "./campaign_sends";
import { campaignLinks } from "./campaign_links";

export const campaignEventType = pgEnum("campaign_event_type", [
  "open",
  "click",
  "bounce",
  "complaint",
  "unsubscribe",
]);

export const campaignEvents = pgTable(
  "campaign_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sendId: uuid("send_id").notNull().references(() => campaignSends.id, { onDelete: "cascade" }),
    eventType: campaignEventType("event_type").notNull(),
    linkId: uuid("link_id").references(() => campaignLinks.id, { onDelete: "set null" }),
    metadata: jsonb("metadata"),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_campaign_events_send_id").on(table.sendId),
    index("idx_campaign_events_event_type").on(table.eventType),
    index("idx_campaign_events_occurred_at").on(table.occurredAt),
  ],
);
