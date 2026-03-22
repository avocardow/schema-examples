// notification_feeds: Named UI surfaces where notifications can appear (e.g., bell icon, activity tab, announcements banner).
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const notificationFeeds = pgTable("notification_feeds", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(), // Display name (e.g., "General", "Activity", "Announcements").
  slug: text("slug").unique().notNull(), // URL-safe identifier used in API calls: GET /feeds/general.
  description: text("description"), // Explain what this feed is for. Shown in admin UI.
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
