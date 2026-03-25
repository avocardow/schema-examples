// webhook_endpoints: Registered HTTP callback URLs for delivering organization events.
// Tracks delivery health via failure counts and timestamps.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const webhook_endpoints = defineTable({
  organizationId: v.id("organizations"),
  url: v.string(),
  description: v.optional(v.string()),
  signingSecret: v.string(),
  status: v.union(
    v.literal("active"),
    v.literal("paused"),
    v.literal("disabled")
  ),
  failureCount: v.number(), // Defaults to 0 at the application layer.
  lastSuccessAt: v.optional(v.number()),
  lastFailureAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_organization_id", ["organizationId"])
  .index("by_status", ["status"]);
