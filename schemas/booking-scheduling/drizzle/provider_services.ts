// provider_services: junction linking providers to the services they offer.
// See README.md for full design rationale.

import { pgTable, uuid, numeric, integer, boolean, timestamp, index, unique } from "drizzle-orm/pg-core";
import { providers } from "./providers";
import { services } from "./services";

export const providerServices = pgTable(
  "provider_services",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    providerId: uuid("provider_id").notNull().references(() => providers.id, { onDelete: "cascade" }),
    serviceId: uuid("service_id").notNull().references(() => services.id, { onDelete: "cascade" }),
    customPrice: numeric("custom_price"),
    customDuration: integer("custom_duration"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_provider_services_provider_id_service_id").on(table.providerId, table.serviceId),
    index("idx_provider_services_service_id").on(table.serviceId),
  ]
);
