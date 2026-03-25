// custom_field_values: stored values for custom fields on individual tickets.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const custom_field_values = defineTable({
  customFieldId: v.id("custom_fields"),
  ticketId: v.id("tickets"),
  value: v.optional(v.string()),
})
  .index("by_custom_field_id_and_ticket_id", ["customFieldId", "ticketId"])
  .index("by_ticket_id", ["ticketId"]);
