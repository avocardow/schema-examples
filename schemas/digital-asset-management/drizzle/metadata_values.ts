// metadata_values: Stores actual custom metadata values for each asset-field pair.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, index, unique } from "drizzle-orm/pg-core";
import { assets } from "./assets";
import { metadataSchemas } from "./metadata_schemas";

export const metadataValues = pgTable(
  "metadata_values",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    assetId: uuid("asset_id").notNull().references(() => assets.id, { onDelete: "cascade" }),
    schemaId: uuid("schema_id").notNull().references(() => metadataSchemas.id, { onDelete: "cascade" }),
    value: text("value").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_metadata_values_asset_id_schema_id").on(table.assetId, table.schemaId),
    index("idx_metadata_values_schema_id").on(table.schemaId),
  ]
);
