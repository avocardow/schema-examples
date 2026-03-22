// glossary_terms: Glossary term definitions for consistent translations.
// See README.md for full design rationale.

import { pgTable, uuid, text, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { locales } from "./locales";
import { users } from "../../auth-rbac/drizzle/users";

export const glossaryTerms = pgTable(
  "glossary_terms",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    term: text("term").notNull(),
    description: text("description"),
    partOfSpeech: text("part_of_speech"),
    domain: text("domain"),
    sourceLocaleId: uuid("source_locale_id")
      .notNull()
      .references(() => locales.id, { onDelete: "restrict" }),
    isForbidden: boolean("is_forbidden").notNull().default(false),
    isCaseSensitive: boolean("is_case_sensitive").notNull().default(false),
    notes: text("notes"),
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
    index("idx_glossary_terms_source_locale_id_term").on(
      table.sourceLocaleId,
      table.term
    ),
    index("idx_glossary_terms_source_locale_id").on(table.sourceLocaleId),
    index("idx_glossary_terms_domain").on(table.domain),
  ]
);
