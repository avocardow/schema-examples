// service_addons: optional extras that can be added to a service booking.
// See README.md for full design rationale.

import { pgTable, uuid, text, integer, numeric, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { services } from "./services";

export const serviceAddons = pgTable(
  "service_addons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serviceId: uuid("service_id").notNull().references(() => services.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    duration: integer("duration").notNull().default(0),
    price: numeric("price").notNull().default("0"),
    currency: text("currency"),
    position: integer("position").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_service_addons_service_id_position").on(table.serviceId, table.position),
    index("idx_service_addons_is_active").on(table.isActive),
  ]
);
