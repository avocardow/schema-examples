// user_restrictions: Active restrictions on user accounts.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const user_restrictions = defineTable({
  // Foreign keys
  userId: v.id("users"), // The restricted user. Cascade: if user is deleted, their restrictions are removed.
  moderationActionId: v.optional(v.id("moderation_actions")), // The moderation action that created this restriction.
  imposedBy: v.id("users"), // Moderator who imposed the restriction. Restrict: don't delete moderators who have imposed restrictions.
  liftedBy: v.optional(v.id("users")), // Moderator who lifted the restriction early.

  // Required fields
  restrictionType: v.union(
    v.literal("ban"),
    v.literal("mute"),
    v.literal("post_restriction"),
    v.literal("shadow_ban"),
    v.literal("warning"),
    v.literal("probation"),
  ),
  scope: v.union(v.literal("global"), v.literal("community"), v.literal("channel")),
  isActive: v.boolean(), // Whether the restriction is currently in effect.

  // Optional fields
  scopeId: v.optional(v.string()), // Community/channel ID. Null when scope = global.
  reason: v.optional(v.string()), // Why the restriction was imposed.

  // Timestamps (no createdAt — Convex provides _creationTime)
  imposedAt: v.number(), // When the restriction was imposed.
  expiresAt: v.optional(v.number()), // When the restriction expires. Null = permanent.
  liftedAt: v.optional(v.number()), // When the restriction was lifted. Null = still active or expired.
  updatedAt: v.number(),
})
  .index("by_user_id_is_active", ["userId", "isActive"])
  .index("by_restriction_type", ["restrictionType"])
  .index("by_scope", ["scope", "scopeId"])
  .index("by_expires_at_is_active", ["expiresAt", "isActive"])
  .index("by_imposed_by", ["imposedBy"]);
