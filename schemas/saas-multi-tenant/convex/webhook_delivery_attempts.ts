// webhook_delivery_attempts: Records each attempt to deliver a webhook message to an endpoint.
// Tracks HTTP response details, timing, and retry scheduling.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const webhook_delivery_attempts = defineTable({
  messageId: v.id("webhook_messages"),
  endpointId: v.id("webhook_endpoints"),
  attemptNumber: v.number(), // Defaults to 1 at the application layer.
  status: v.union(
    v.literal("pending"),
    v.literal("success"),
    v.literal("failed")
  ),
  httpStatus: v.optional(v.number()),
  responseBody: v.optional(v.string()),
  errorMessage: v.optional(v.string()),
  attemptedAt: v.optional(v.number()),
  durationMs: v.optional(v.number()),
  nextRetryAt: v.optional(v.number()),
})
  .index("by_message_id_and_attempt_number", ["messageId", "attemptNumber"])
  .index("by_endpoint_id_and_creation_time", ["endpointId", "_creationTime"])
  .index("by_status_and_next_retry_at", ["status", "nextRetryAt"]);
