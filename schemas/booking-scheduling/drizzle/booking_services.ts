// booking_services: snapshot of services and addons included in a booking.
// See README.md for full design rationale.

import { pgTable, uuid, text, integer, numeric, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { bookings } from "./bookings";
import { services } from "./services";
import { serviceAddons } from "./service_addons";

export const bookingServices = pgTable(
  "booking_services",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bookingId: uuid("booking_id").notNull().references(() => bookings.id, { onDelete: "cascade" }),
    serviceId: uuid("service_id").references(() => services.id, { onDelete: "set null" }),
    addonId: uuid("addon_id").references(() => serviceAddons.id, { onDelete: "set null" }),
    serviceName: text("service_name").notNull(),
    duration: integer("duration").notNull(),
    price: numeric("price"),
    currency: text("currency"),
    isPrimary: boolean("is_primary").notNull().default(true),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_booking_services_booking_id").on(table.bookingId),
    index("idx_booking_services_service_id").on(table.serviceId),
  ]
);
