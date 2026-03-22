// device_tokens: Push notification device tokens and web push subscriptions per user/device.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const device_tokens = defineTable({
  userId: v.id("users"),

  // Platform: which type of device/browser this token is for.
  platform: v.union(
    v.literal("ios"),
    v.literal("android"),
    v.literal("web"),
    v.literal("macos"),
    v.literal("windows")
  ),

  // The push token itself — opaque string from FCM, APNs, or the web push endpoint.
  token: v.string(),

  // Which push service provider issued/manages this token (e.g., "fcm", "apns", "web_push").
  provider: v.string(),

  // App identifier for multi-app setups (e.g., Firebase project ID, APNs bundle ID).
  appId: v.optional(v.string()),

  // Web Push specific fields (RFC 8030 / VAPID). Null for native push tokens.
  p256dhKey: v.optional(v.string()), // ECDH P-256 public key from the browser.
  authKey: v.optional(v.string()), // 16-byte authentication secret from the browser.
  endpointUrl: v.optional(v.string()), // Web push endpoint URL.

  // Device metadata.
  deviceName: v.optional(v.string()), // User-friendly label, e.g., "iPhone 15 Pro".
  deviceModel: v.optional(v.string()), // Machine-readable model ID, e.g., "iPhone15,3".
  osVersion: v.optional(v.string()),
  appVersion: v.optional(v.string()),

  isActive: v.boolean(), // False when the provider reports the token as invalid.
  lastUsedAt: v.optional(v.number()), // When a push was last successfully sent to this token.
  expiresAt: v.optional(v.number()), // Some tokens have explicit expiry.

  updatedAt: v.number(),
})
  .index("by_user_id", ["userId"])
  .index("by_user_id_platform_is_active", ["userId", "platform", "isActive"])
  .index("by_token_provider", ["token", "provider"])
  .index("by_is_active_last_used_at", ["isActive", "lastUsedAt"]);
