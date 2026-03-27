// suppression_entries: Global suppression list preventing emails to bounced or complained addresses.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, index, pgEnum } from "drizzle-orm/pg-core";
import { campaigns } from "./campaigns";
import { users } from "./users";

export const suppressionReason = pgEnum("suppression_reason", [
  "hard_bounce",
  "complaint",
  "manual",
  "list_unsubscribe",
]);

export const suppressionEntries = pgTable(
  "suppression_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").unique().notNull(),
    reason: suppressionReason("reason").notNull(),
    sourceCampaignId: uuid("source_campaign_id").references(() => campaigns.id, { onDelete: "set null" }),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_suppression_entries_reason").on(table.reason),
  ],
);
