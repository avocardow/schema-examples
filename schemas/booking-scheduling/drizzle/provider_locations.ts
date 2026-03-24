// provider_locations: junction linking providers to the locations where they work.
// See README.md for full design rationale.

import { pgTable, uuid, boolean, timestamp, index, unique } from "drizzle-orm/pg-core";
import { providers } from "./providers";
import { locations } from "./locations";

export const providerLocations = pgTable(
  "provider_locations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    providerId: uuid("provider_id").notNull().references(() => providers.id, { onDelete: "cascade" }),
    locationId: uuid("location_id").notNull().references(() => locations.id, { onDelete: "cascade" }),
    isPrimary: boolean("is_primary").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_provider_locations_provider_id_location_id").on(table.providerId, table.locationId),
    index("idx_provider_locations_location_id").on(table.locationId),
  ]
);
