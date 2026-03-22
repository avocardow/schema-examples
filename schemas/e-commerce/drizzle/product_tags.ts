// product_tags: Lightweight labels for flexible product categorisation.
// See README.md for full design rationale.
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const productTags = pgTable("product_tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
