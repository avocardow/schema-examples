// locations: physical or virtual venues where services are provided.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, boolean, integer, timestamp, index } from "drizzle-orm/pg-core";

export const locationTypeEnum = pgEnum("location_type", ["physical", "virtual"]);

export const locations = pgTable(
  "locations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").unique().notNull(),
    type: locationTypeEnum("type").notNull().default("physical"),
    description: text("description"),
    addressLine1: text("address_line1"),
    addressLine2: text("address_line2"),
    city: text("city"),
    state: text("state"),
    postalCode: text("postal_code"),
    country: text("country"),
    virtualUrl: text("virtual_url"),
    timezone: text("timezone").notNull(),
    phone: text("phone"),
    email: text("email"),
    isActive: boolean("is_active").notNull().default(true),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_locations_type").on(table.type),
    index("idx_locations_is_active_position").on(table.isActive, table.position),
  ]
);
