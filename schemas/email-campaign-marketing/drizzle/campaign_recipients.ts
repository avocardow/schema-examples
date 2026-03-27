// campaign_recipients: Links campaigns to target lists and segments.
// See README.md for full design rationale.

import { pgTable, uuid, timestamp, index } from "drizzle-orm/pg-core";
import { campaigns } from "./campaigns";
import { contactLists } from "./contact_lists";
import { segments } from "./segments";

export const campaignRecipients = pgTable(
  "campaign_recipients",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    campaignId: uuid("campaign_id").notNull().references(() => campaigns.id, { onDelete: "cascade" }),
    listId: uuid("list_id").references(() => contactLists.id, { onDelete: "cascade" }),
    segmentId: uuid("segment_id").references(() => segments.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_campaign_recipients_campaign_id").on(table.campaignId),
    index("idx_campaign_recipients_list_id").on(table.listId),
    index("idx_campaign_recipients_segment_id").on(table.segmentId),
  ],
);
