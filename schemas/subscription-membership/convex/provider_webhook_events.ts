// provider_webhook_events: raw webhook event log.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const provider_webhook_events = defineTable({
  providerType: v.string(),
  providerEventId: v.string(),
  eventType: v.string(),
  payload: v.any(),
  processedAt: v.optional(v.number()),
  processingError: v.optional(v.string()),
})
  .index("by_provider_event", ["providerType", "providerEventId"])
  .index("by_event_type", ["eventType"])
  .index("by_processed_at", ["processedAt"]);
