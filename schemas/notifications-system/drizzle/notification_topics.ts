// notification_topics: Named pub/sub groups for fan-out delivery.
// See README.md for full design rationale.

import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const notificationTopics = pgTable("notification_topics", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(), // Display name (e.g., "Project Updates", "Marketing Newsletter").
  slug: text("slug").unique().notNull(), // Identifier used in code and API (e.g., "project_updates", "marketing").
  description: text("description"), // Explain what subscribing to this topic means.
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
