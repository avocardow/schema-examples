// notification_preference_defaults: System-level and tenant-level default preferences. Forms the base layers of the three-tier preference hierarchy.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  timestamp,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { notificationCategories } from "./notification_categories";
import { channelType } from "./notification_channels";

// Scope: "system" = all users platform-wide, "tenant" = all users within a specific organization.
export const preferenceDefaultScope = pgEnum("preference_default_scope", [
  "system",
  "tenant",
]);

export const notificationPreferenceDefaults = pgTable(
  "notification_preference_defaults",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    scope: preferenceDefaultScope("scope").notNull(),
    scopeId: text("scope_id"), // The tenant/org ID. Null when scope = "system".

    categoryId: uuid("category_id").references(
      () => notificationCategories.id,
      { onDelete: "cascade" }
    ),
    channelType: channelType("channel_type"),

    enabled: boolean("enabled").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    unique("uq_notification_preference_defaults_scope_sid_cat_chan").on(
      table.scope,
      table.scopeId,
      table.categoryId,
      table.channelType,
    ),
    index("idx_notification_preference_defaults_scope_scope_id").on(
      table.scope,
      table.scopeId,
    ),
    index("idx_notification_preference_defaults_scope").on(table.scope),
  ]
);
