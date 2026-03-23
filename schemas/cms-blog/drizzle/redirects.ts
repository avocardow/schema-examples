// redirects: URL redirect rules for SEO and content migration.
// See README.md for full design rationale.
import { pgTable, uuid, text, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";

export const redirects = pgTable("redirects", {
  id: uuid("id").primaryKey().defaultRandom(),
  sourcePath: text("source_path").notNull().unique(),
  targetPath: text("target_path").notNull(),
  statusCode: integer("status_code").notNull().default(301),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("idx_redirects_is_active").on(table.isActive),
]);
