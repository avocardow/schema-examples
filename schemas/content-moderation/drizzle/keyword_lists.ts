// keyword_lists: Managed word/phrase lists for auto-moderation.
// See README.md for full design rationale.

import {
  pgEnum,
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";

export const keywordListTypeEnum = pgEnum("keyword_list_type", [
  "blocklist",
  "allowlist",
  "watchlist",
]);

export const keywordListScopeEnum = pgEnum("keyword_list_scope", [
  "global",
  "community",
]);

export const keywordLists = pgTable(
  "keyword_lists",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(), // List name (e.g., "Profanity — English", "Competitor URLs").
    description: text("description"), // What this list contains and how it's used.

    // blocklist = content matching these entries is blocked/flagged.
    // allowlist = entries that override blocklist matches.
    // watchlist = entries that flag content for review.
    listType: keywordListTypeEnum("list_type").notNull(),

    scope: keywordListScopeEnum("scope").notNull().default("global"),
    scopeId: text("scope_id"), // Community ID. Null when scope = global.

    isEnabled: boolean("is_enabled").notNull().default(true),

    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_keyword_lists_scope_scope_id").on(table.scope, table.scopeId),
    index("idx_keyword_lists_list_type").on(table.listType),
    index("idx_keyword_lists_is_enabled").on(table.isEnabled),
  ]
);
