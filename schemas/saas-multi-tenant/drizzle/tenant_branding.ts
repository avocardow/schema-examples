// tenant_branding: Per-organization visual identity and support contact settings.
// See README.md for full schema documentation.

import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";

export const tenantBranding = pgTable("tenant_branding", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .unique()
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  logoUrl: text("logo_url"),
  logoDarkUrl: text("logo_dark_url"),
  faviconUrl: text("favicon_url"),
  primaryColor: text("primary_color"),
  accentColor: text("accent_color"),
  backgroundColor: text("background_color"),
  customCss: text("custom_css"),
  supportEmail: text("support_email"),
  supportUrl: text("support_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
});
