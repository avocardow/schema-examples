// keyword_list_entries: Individual words/phrases in keyword lists.
// See README.md for full design rationale.

import {
  pgEnum,
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { keywordLists } from "./keyword_lists";
import { users } from "../../auth-rbac/drizzle/users";

export const keywordListEntryMatchTypeEnum = pgEnum(
  "keyword_match_type",
  ["exact", "contains", "regex"]
);

export const keywordListEntries = pgTable(
  "keyword_list_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    listId: uuid("list_id")
      .notNull()
      .references(() => keywordLists.id, { onDelete: "cascade" }),
    value: text("value").notNull(),
    matchType: keywordListEntryMatchTypeEnum("match_type")
      .notNull()
      .default("exact"),
    isCaseSensitive: boolean("is_case_sensitive").notNull().default(false),
    addedBy: uuid("added_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique("uq_keyword_list_entries_list_value_match_type").on(
      table.listId,
      table.value,
      table.matchType
    ),
  ]
);
