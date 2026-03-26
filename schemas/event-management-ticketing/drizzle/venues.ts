// venues: Physical, virtual, or hybrid locations where events take place.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  numeric,
  integer,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";

export const venueTypeEnum = pgEnum("venue_type", [
  "physical",
  "virtual",
  "hybrid",
]);

export const venues = pgTable(
  "venues",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    type: venueTypeEnum("type").notNull().default("physical"),
    addressLine1: text("address_line1"),
    addressLine2: text("address_line2"),
    city: text("city"),
    state: text("state"),
    postalCode: text("postal_code"),
    country: text("country"),
    latitude: numeric("latitude"),
    longitude: numeric("longitude"),
    virtualUrl: text("virtual_url"),
    virtualPlatform: text("virtual_platform"),
    capacity: integer("capacity"),
    timezone: text("timezone").notNull(),
    phone: text("phone"),
    email: text("email"),
    websiteUrl: text("website_url"),
    isActive: boolean("is_active").notNull().default(true),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_venues_type").on(table.type),
    index("idx_venues_city_state").on(table.city, table.state),
    index("idx_venues_is_active").on(table.isActive),
    index("idx_venues_created_by").on(table.createdBy),
  ],
);
