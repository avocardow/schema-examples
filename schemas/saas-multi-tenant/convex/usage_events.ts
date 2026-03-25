// usage_events: Tracks per-organization feature consumption for metering and billing.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const usage_events = defineTable({
  organizationId: v.id("organizations"),
  featureId: v.id("features"),
  quantity: v.number(),
  userId: v.optional(v.id("users")),
  metadata: v.optional(v.any()),
  idempotencyKey: v.optional(v.string()),
})
  .index("by_organization_id_and_feature_id_and_creation_time", [
    "organizationId",
    "featureId",
    "_creationTime",
  ])
  .index("by_idempotency_key", ["idempotencyKey"]);
