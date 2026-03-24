// services: bookable service definitions with pricing, duration, and capacity settings.
// See README.md for full design rationale.

import { pgTable, uuid, text, integer, numeric, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { serviceCategories } from "./service_categories";
import { users } from "./users";

export const services = pgTable(
  "services",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id").references(() => serviceCategories.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    slug: text("slug").unique().notNull(),
    description: text("description"),
    duration: integer("duration").notNull(),
    bufferBefore: integer("buffer_before").notNull().default(0),
    bufferAfter: integer("buffer_after").notNull().default(0),
    price: numeric("price"),
    currency: text("currency"),
    maxAttendees: integer("max_attendees").notNull().default(1),
    minAttendees: integer("min_attendees").notNull().default(1),
    minNotice: integer("min_notice").notNull().default(0),
    maxAdvance: integer("max_advance").notNull().default(43200),
    slotInterval: integer("slot_interval"),
    isActive: boolean("is_active").notNull().default(true),
    isPrivate: boolean("is_private").notNull().default(false),
    color: text("color"),
    createdBy: uuid("created_by").notNull().references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("idx_services_category_id").on(table.categoryId),
    index("idx_services_is_active_is_private").on(table.isActive, table.isPrivate),
    index("idx_services_created_by").on(table.createdBy),
  ]
);
