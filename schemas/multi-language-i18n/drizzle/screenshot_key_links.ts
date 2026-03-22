// screenshot_key_links: Links between screenshots and translation keys with optional bounding boxes.
// See README.md for full design rationale.

import { pgTable, uuid, integer, timestamp, index, unique } from "drizzle-orm/pg-core";
import { screenshots } from "./screenshots";
import { translationKeys } from "./translation_keys";

export const screenshotKeyLinks = pgTable(
  "screenshot_key_links",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    screenshotId: uuid("screenshot_id")
      .notNull()
      .references(() => screenshots.id, { onDelete: "cascade" }),
    translationKeyId: uuid("translation_key_id")
      .notNull()
      .references(() => translationKeys.id, { onDelete: "cascade" }),
    x: integer("x"),
    y: integer("y"),
    width: integer("width"),
    height: integer("height"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique("uq_screenshot_key_links_screenshot_id_translation_key_id").on(
      table.screenshotId,
      table.translationKeyId
    ),
    index("idx_screenshot_key_links_translation_key_id").on(
      table.translationKeyId
    ),
  ]
);
