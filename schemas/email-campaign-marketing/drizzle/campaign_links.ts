// campaign_links: Tracked URLs within campaign emails for click analytics.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, integer, unique } from "drizzle-orm/pg-core";
import { campaigns } from "./campaigns";

export const campaignLinks = pgTable(
  "campaign_links",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    campaignId: uuid("campaign_id").notNull().references(() => campaigns.id, { onDelete: "cascade" }),
    originalUrl: text("original_url").notNull(),
    position: integer("position"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_campaign_links_campaign_url").on(table.campaignId, table.originalUrl),
  ],
);
