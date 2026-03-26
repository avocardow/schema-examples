// vendor_profiles: Public-facing storefront information and policies for each vendor.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { vendors } from "./vendors";

export const vendorProfiles = pgTable(
  "vendor_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    vendorId: uuid("vendor_id")
      .notNull()
      .unique()
      .references(() => vendors.id, { onDelete: "cascade" }),
    displayName: text("display_name").notNull(),
    tagline: text("tagline"),
    description: text("description"),
    logoUrl: text("logo_url"),
    bannerUrl: text("banner_url"),
    websiteUrl: text("website_url"),
    socialLinks: jsonb("social_links"),
    returnPolicy: text("return_policy"),
    shippingPolicy: text("shipping_policy"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  }
);
