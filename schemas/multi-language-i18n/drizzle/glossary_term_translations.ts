// glossary_term_translations: Translations of glossary terms per locale.
// See README.md for full design rationale.

import { pgEnum, pgTable, uuid, text, timestamp, index, unique } from "drizzle-orm/pg-core";
import { glossaryTerms } from "./glossary_terms";
import { locales } from "./locales";

export const glossaryTermStatusEnum = pgEnum("glossary_term_status", [
  "draft",
  "approved",
]);

export const glossaryTermTranslations = pgTable(
  "glossary_term_translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    termId: uuid("term_id")
      .notNull()
      .references(() => glossaryTerms.id, { onDelete: "cascade" }),
    localeId: uuid("locale_id")
      .notNull()
      .references(() => locales.id, { onDelete: "cascade" }),
    translation: text("translation").notNull(),
    notes: text("notes"),
    status: glossaryTermStatusEnum("status").notNull().default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    unique("uq_glossary_term_translations_term_id_locale_id").on(
      table.termId,
      table.localeId
    ),
    index("idx_glossary_term_translations_locale_id").on(table.localeId),
  ]
);
