// ticket_attachments: files attached to ticket messages with metadata.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const ticket_attachments = defineTable({
  ticketId: v.id("tickets"),
  messageId: v.optional(v.id("ticket_messages")),
  fileName: v.string(),
  fileUrl: v.string(),
  fileSize: v.optional(v.number()),
  mimeType: v.optional(v.string()),
  uploadedBy: v.id("users"),
})
  .index("by_ticket_id", ["ticketId"])
  .index("by_message_id", ["messageId"]);
