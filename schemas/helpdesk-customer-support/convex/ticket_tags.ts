// ticket_tags: join table linking tags to tickets for many-to-many classification.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const ticket_tags = defineTable({
  ticketId: v.id("tickets"),
  tagId: v.id("tags"),
})
  .index("by_ticket_id_and_tag_id", ["ticketId", "tagId"])
  .index("by_tag_id", ["tagId"]);
