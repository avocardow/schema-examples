// renditions: Pre-generated derivative formats and sizes of assets.
// See README.md for full design rationale.

import { pgTable, uuid, text, integer, bigint, timestamp, unique } from "drizzle-orm/pg-core";
import { assets } from "./assets";

export const renditions = pgTable(
  "renditions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    assetId: uuid("asset_id").notNull().references(() => assets.id, { onDelete: "cascade" }),
    presetName: text("preset_name").notNull(),
    storageKey: text("storage_key").notNull(),
    mimeType: text("mime_type").notNull(),
    fileSize: bigint("file_size", { mode: "number" }).notNull(),
    width: integer("width"),
    height: integer("height"),
    format: text("format").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("uq_renditions_asset_id_preset_name").on(table.assetId, table.presetName),
  ]
);
