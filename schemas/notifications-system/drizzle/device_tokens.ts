// device_tokens: Push notification device tokens and web push subscriptions.
// Each row is one device/browser that can receive push notifications for a user.
// See README.md for full design rationale and field documentation.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "../../auth-rbac/drizzle/users";

// Platform: which type of device/browser this token is for.
export const deviceTokenPlatform = pgEnum("device_token_platform", [
  "ios",
  "android",
  "web",
  "macos",
  "windows",
]);

export const deviceTokens = pgTable(
  "device_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    platform: deviceTokenPlatform("platform").notNull(),

    // The push token itself — opaque string from FCM, APNs, or web push endpoint.
    token: text("token").notNull(),

    // Which push service provider issued/manages this token (e.g., "fcm", "apns", "web_push", "onesignal", "expo").
    provider: text("provider").notNull(),

    // App identifier for multi-app setups (e.g., Firebase project ID, APNs bundle ID).
    appId: text("app_id"),

    // Web Push specific fields (RFC 8030 / VAPID). Null for native push tokens.
    p256dhKey: text("p256dh_key"), // ECDH P-256 public key from the browser.
    authKey: text("auth_key"), // 16-byte authentication secret from the browser.
    endpointUrl: text("endpoint_url"), // Web push endpoint URL.

    // Device metadata.
    deviceName: text("device_name"), // e.g., "iPhone 15 Pro", "Chrome on MacBook".
    deviceModel: text("device_model"), // e.g., "iPhone15,3", "Pixel 8".
    osVersion: text("os_version"), // e.g., "17.2", "14".
    appVersion: text("app_version"), // e.g., "2.1.0".

    isActive: boolean("is_active").notNull().default(true), // False when provider reports token invalid.
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }), // Last successful push to this token.
    expiresAt: timestamp("expires_at", { withTimezone: true }), // Explicit expiry. Null = no known expiry.

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_device_tokens_user_id").on(table.userId),
    index("idx_device_tokens_user_platform_active").on(
      table.userId,
      table.platform,
      table.isActive
    ),
    index("idx_device_tokens_token_provider").on(table.token, table.provider),
    index("idx_device_tokens_active_last_used").on(
      table.isActive,
      table.lastUsedAt
    ),
  ]
);
