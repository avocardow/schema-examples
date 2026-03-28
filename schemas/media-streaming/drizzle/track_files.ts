// track_files: Physical audio file variants for each track at different quality levels.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { tracks } from "./tracks";
import { files } from "./files";

export const trackQualityEnum = pgEnum("track_quality", ["low", "normal", "high", "lossless"]);

export const trackFiles = pgTable(
  "track_files",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    trackId: uuid("track_id").notNull().references(() => tracks.id, { onDelete: "cascade" }),
    fileId: uuid("file_id").notNull().references(() => files.id, { onDelete: "restrict" }),
    quality: trackQualityEnum("quality").notNull(),
    codec: text("codec").notNull(),
    bitrateKbps: integer("bitrate_kbps"),
    sampleRateHz: integer("sample_rate_hz"),
    fileSizeBytes: integer("file_size_bytes").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_track_files_track_id_quality").on(table.trackId, table.quality),
    index("idx_track_files_file_id").on(table.fileId),
  ]
);
