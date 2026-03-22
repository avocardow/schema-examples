// translation_memory_entries: Reusable translation pairs for translation memory.
// See README.md for full design rationale.

import { pgTable, uuid, text, integer, numeric, timestamp, index } from "drizzle-orm/pg-core";
import { locales } from "./locales";
import { users } from "../../auth-rbac/drizzle/users";

export const translationMemoryEntries = pgTable(
  "translation_memory_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sourceLocaleId: uuid("source_locale_id")
      .notNull()
      .references(() => locales.id, { onDelete: "cascade" }),
    targetLocaleId: uuid("target_locale_id")
      .notNull()
      .references(() => locales.id, { onDelete: "cascade" }),
    sourceText: text("source_text").notNull(),
    targetText: text("target_text").notNull(),
    sourceHash: text("source_hash").notNull(),
    domain: text("domain"),
    qualityScore: numeric("quality_score", { precision: 3, scale: 2 }),
    usageCount: integer("usage_count").notNull().default(0),
    source: text("source").notNull().default("human"),
    createdBy: uuid("created_by").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_translation_memory_entries_source_locale_id_target_locale_id_source_hash").on(
      table.sourceLocaleId,
      table.targetLocaleId,
      table.sourceHash
    ),
    index("idx_translation_memory_entries_source_locale_id_target_locale_id").on(
      table.sourceLocaleId,
      table.targetLocaleId
    ),
    index("idx_translation_memory_entries_domain").on(table.domain),
  ]
);
