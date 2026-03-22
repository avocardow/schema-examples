// event_properties: Key-value properties for events.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const event_properties = defineTable({
  eventId: v.id("events"),
  key: v.string(),
  value: v.string(),
})
  .index("by_event_id_and_key", ["eventId", "key"])
  .index("by_key_and_value", ["key", "value"]);
