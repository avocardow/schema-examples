// affiliate_links: Trackable links that affiliates share to earn commissions.
// Each link has a unique token for click/conversion attribution.
// See README.md for full design rationale.

import { pgTable, uuid, text, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { affiliates } from "./affiliates";

export const affiliateLinks = pgTable("affiliate_links", {
    id: uuid("id").primaryKey().defaultRandom(),
    affiliateId: uuid("affiliate_id").notNull().references(() => affiliates.id, { onDelete: "cascade" }),
    token: text("token").unique().notNull(),
    slug: text("slug"),
    destinationUrl: text("destination_url").notNull(),
    label: text("label"),
    totalClicks: integer("total_clicks").notNull().default(0),
    totalConversions: integer("total_conversions").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  }, (table) => [
    index("idx_affiliate_links_affiliate_id").on(table.affiliateId),
  ]
);
