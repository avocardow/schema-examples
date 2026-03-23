// series: Ordered collections of related posts for sequential reading.
// See README.md for full design rationale.
import { pgTable, uuid, text, boolean, timestamp, index } from "drizzle-orm/pg-core";

export const series = pgTable("series", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  coverImageUrl: text("cover_image_url"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("idx_series_is_active").on(table.isActive),
]);
