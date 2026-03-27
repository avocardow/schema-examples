// clicks: Individual click events on affiliate links with device/geo metadata.
// See README.md for full design rationale.

import { pgTable, uuid, text, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { affiliateLinks } from "./affiliate_links";

export const clicks = pgTable("clicks", {
    id: uuid("id").primaryKey().defaultRandom(),
    affiliateLinkId: uuid("affiliate_link_id").notNull().references(() => affiliateLinks.id, { onDelete: "cascade" }),
    clickId: text("click_id").unique().notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    refererUrl: text("referer_url"),
    landingUrl: text("landing_url"),
    country: text("country"),
    deviceType: text("device_type"),
    isUnique: boolean("is_unique").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  }, (table) => [
    index("idx_clicks_affiliate_link_id_created_at").on(table.affiliateLinkId, table.createdAt),
    index("idx_clicks_created_at").on(table.createdAt),
  ]
);
