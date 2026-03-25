// canned_responses: reusable reply templates for agents organized by folder.
// See README.md for full design rationale.

import { pgTable, uuid, text, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const cannedResponses = pgTable(
  "canned_responses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    content: text("content").notNull(),
    folder: text("folder"),
    createdById: uuid("created_by_id").notNull().references(() => users.id, { onDelete: "restrict" }),
    isShared: boolean("is_shared").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_canned_responses_folder").on(table.folder),
    index("idx_canned_responses_created_by_id").on(table.createdById),
    index("idx_canned_responses_is_shared").on(table.isShared),
  ]
);
