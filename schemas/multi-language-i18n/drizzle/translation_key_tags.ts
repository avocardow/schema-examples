// translation_key_tags: Tags associated with translation keys for categorization.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp, index, unique } from "drizzle-orm/pg-core";
import { translationKeys } from "./translation_keys";

export const translationKeyTags = pgTable(
  "translation_key_tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    translationKeyId: uuid("translation_key_id")
      .notNull()
      .references(() => translationKeys.id, { onDelete: "cascade" }),
    tag: text("tag").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique("uq_translation_key_tags_translation_key_id_tag").on(
      table.translationKeyId,
      table.tag
    ),
    index("idx_translation_key_tags_tag").on(table.tag),
  ]
);
