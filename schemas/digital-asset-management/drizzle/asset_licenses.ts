// asset_licenses: Associates license terms with specific assets including date ranges.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";
import { assets } from "./assets";
import { licenses } from "./licenses";

export const assetLicenses = pgTable(
  "asset_licenses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    assetId: uuid("asset_id").notNull().references(() => assets.id, { onDelete: "cascade" }),
    licenseId: uuid("license_id").notNull().references(() => licenses.id, { onDelete: "cascade" }),
    effectiveDate: text("effective_date").notNull(),
    expiryDate: text("expiry_date"),
    notes: text("notes"),
    assignedBy: uuid("assigned_by").notNull().references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_asset_licenses_asset_id").on(table.assetId),
    index("idx_asset_licenses_license_id").on(table.licenseId),
    index("idx_asset_licenses_expiry_date").on(table.expiryDate),
  ]
);
