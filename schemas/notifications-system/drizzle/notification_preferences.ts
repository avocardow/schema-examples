// notification_preferences: Per-user opt-in/opt-out controls for the category x channel preference matrix.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  boolean,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "../../auth-rbac/drizzle/users";
import { notificationCategories } from "./notification_categories";
import { channelType } from "./notification_channels";

export const notificationPreferences = pgTable(
  "notification_preferences",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Category scope: null = global preference (applies to all categories without a specific override).
    categoryId: uuid("category_id").references(
      () => notificationCategories.id,
      { onDelete: "cascade" }
    ),

    // Channel scope: null = all channels (applies to all channels without a specific override).
    channelType: channelType("channel_type"),

    // The preference value. Does NOT override is_required categories.
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
    // Four partial unique indexes to enforce uniqueness across all nullable column combinations.
    // PostgreSQL treats NULL != NULL, so a single composite unique constraint cannot cover all cases.

    // Case 1: both category_id and channel_type are set.
    uniqueIndex("uq_notification_prefs_user_cat_chan")
      .on(table.userId, table.categoryId, table.channelType)
      .where(
        sql`${table.categoryId} IS NOT NULL AND ${table.channelType} IS NOT NULL`
      ),

    // Case 2: category_id is set, channel_type is null (category-wide preference).
    uniqueIndex("uq_notification_prefs_user_cat_null_chan")
      .on(table.userId, table.categoryId)
      .where(
        sql`${table.categoryId} IS NOT NULL AND ${table.channelType} IS NULL`
      ),

    // Case 3: category_id is null, channel_type is set (channel-wide preference).
    uniqueIndex("uq_notification_prefs_user_null_cat_chan")
      .on(table.userId, table.channelType)
      .where(
        sql`${table.categoryId} IS NULL AND ${table.channelType} IS NOT NULL`
      ),

    // Case 4: both null (global preference).
    uniqueIndex("uq_notification_prefs_user_global")
      .on(table.userId)
      .where(
        sql`${table.categoryId} IS NULL AND ${table.channelType} IS NULL`
      ),

    index("idx_notification_preferences_user_id").on(table.userId),
    index("idx_notification_preferences_user_category").on(
      table.userId,
      table.categoryId
    ),
  ]
);
