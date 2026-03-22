// translation_keys: Individual translatable string keys within namespaces.
// See README.md for full design rationale.

import { pgTable, uuid, text, boolean, integer, timestamp, index, unique } from "drizzle-orm/pg-core";
import { namespaces } from "./namespaces";

export const translationKeys = pgTable(
  "translation_keys",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    namespaceId: uuid("namespace_id")
      .notNull()
      .references(() => namespaces.id, { onDelete: "cascade" }),
    key: text("key").notNull(),
    description: text("description"),
    maxLength: integer("max_length"),
    isPlural: boolean("is_plural").notNull().default(false),
    format: text("format").notNull().default("text"),
    isHidden: boolean("is_hidden").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    unique("uq_translation_keys_namespace_id_key").on(
      table.namespaceId,
      table.key
    ),
    index("idx_translation_keys_is_plural").on(table.isPlural),
  ]
);
