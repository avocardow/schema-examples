// funnel_steps: Steps within a funnel.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const funnel_steps = defineTable({
  funnelId: v.id("funnels"),
  eventTypeId: v.id("event_types"),
  stepOrder: v.number(),
  name: v.optional(v.string()),
})
  .index("by_funnel_id_and_step_order", ["funnelId", "stepOrder"])
  .index("by_funnel_id_and_event_type_id", ["funnelId", "eventTypeId"]);
