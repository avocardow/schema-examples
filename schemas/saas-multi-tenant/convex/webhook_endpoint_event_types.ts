// webhook_endpoint_event_types: Maps webhook endpoints to the event types they subscribe to.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const webhook_endpoint_event_types = defineTable({
  endpointId: v.id("webhook_endpoints"),
  eventTypeId: v.id("webhook_event_types"),
})
  .index("by_endpoint_id_and_event_type_id", ["endpointId", "eventTypeId"])
  .index("by_event_type_id", ["eventTypeId"]);
