// vendor_addresses: Physical addresses for vendor business, warehouse, and return locations.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { vendors } from "./vendors";

export const vendorAddressType = pgEnum("vendor_address_type", [
  "business",
  "warehouse",
  "return",
]);

export const vendorAddresses = pgTable(
  "vendor_addresses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    vendorId: uuid("vendor_id")
      .notNull()
      .references(() => vendors.id, { onDelete: "cascade" }),
    type: vendorAddressType("type").notNull(),
    label: text("label"),
    addressLine1: text("address_line1").notNull(),
    addressLine2: text("address_line2"),
    city: text("city").notNull(),
    region: text("region"),
    postalCode: text("postal_code"),
    country: text("country").notNull(),
    phone: text("phone"),
    isDefault: boolean("is_default").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_vendor_addresses_vendor_id_type").on(
      table.vendorId,
      table.type
    ),
  ]
);
