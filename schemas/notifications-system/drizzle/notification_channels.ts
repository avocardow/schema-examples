// notification_channels: Configured delivery provider instances for each channel type.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  integer,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const channelType = pgEnum("channel_type", [
  "email",
  "sms",
  "push",
  "in_app",
  "chat",
  "webhook",
]);

export const notificationChannels = pgTable(
  "notification_channels",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    channelType: channelType("channel_type").notNull(),
    provider: text("provider").notNull(), // e.g. 'sendgrid', 'twilio', 'fcm', 'slack', 'custom'.
    name: text("name").notNull(), // Display name (e.g., "SendGrid Production", "Twilio SMS").

    // ⚠️  Provider credentials MUST be encrypted at rest.
    credentials: jsonb("credentials").notNull(),

    isActive: boolean("is_active").notNull().default(true),
    isPrimary: boolean("is_primary").notNull().default(false), // Only one channel per channel_type should be primary.
    priority: integer("priority").notNull().default(0), // Failover priority: lower = higher priority.

    config: jsonb("config").default(sql`'{}'`), // Provider-specific configuration.

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_notification_channels_type_active").on(
      table.channelType,
      table.isActive
    ),
    index("idx_notification_channels_type_primary").on(
      table.channelType,
      table.isPrimary
    ),
    index("idx_notification_channels_type_priority").on(
      table.channelType,
      table.priority
    ),
  ]
);
