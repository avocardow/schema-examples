// notification_subscriptions: Links users to topics with per-channel granularity for fan-out delivery.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "../../auth-rbac/drizzle/users";
import { notificationTopics } from "./notification_topics";
import { channelType } from "./notification_channels";

export const notificationSubscriptions = pgTable(
  "notification_subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    topicId: uuid("topic_id")
      .notNull()
      .references(() => notificationTopics.id, { onDelete: "cascade" }),

    // Channel scope: null = subscribed on all channels.
    // Set to a specific channel to subscribe only that channel.
    channelType: channelType("channel_type"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    // Two partial unique indexes to enforce one subscription per user per topic per channel.
    // PostgreSQL treats NULL != NULL, so a single composite unique cannot cover nullable channel_type.

    // Case 1: channel_type is set.
    uniqueIndex("uq_notification_subs_user_topic_chan")
      .on(table.userId, table.topicId, table.channelType)
      .where(sql`${table.channelType} IS NOT NULL`),

    // Case 2: channel_type is null (all-channels subscription).
    uniqueIndex("uq_notification_subs_user_topic_null_chan")
      .on(table.userId, table.topicId)
      .where(sql`${table.channelType} IS NULL`),

    index("idx_notification_subscriptions_topic_id").on(table.topicId),
    index("idx_notification_subscriptions_user_id").on(table.userId),
  ]
);
