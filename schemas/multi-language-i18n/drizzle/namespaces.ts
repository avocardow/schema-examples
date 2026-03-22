// namespaces: Logical groupings for translation keys.
// See README.md for full design rationale.

import { pgTable, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const namespaces = pgTable("namespaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").unique().notNull(),
  description: text("description"),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
