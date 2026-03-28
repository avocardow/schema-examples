// Distribution targets for syndicating shows to external podcast platforms
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { shows } from "./shows";

export const distributionStatusEnum = pgEnum("distribution_status_enum", ["pending", "active", "rejected", "suspended"]);

export const distributionTargets = pgTable(
  "distribution_targets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    showId: uuid("show_id").notNull().references(() => shows.id, { onDelete: "cascade" }),
    platform: text("platform").notNull(),
    externalId: text("external_id"),
    status: distributionStatusEnum("status").notNull().default("pending"),
    feedUrlOverride: text("feed_url_override"),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_distribution_targets_show_id_platform").on(table.showId, table.platform),
    index("idx_distribution_targets_status").on(table.status),
  ]
);
