// message_attachments: File references attached to messages.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const messageAttachments = defineTable({
  messageId: v.id("messages"),
  fileId: v.id("files"),
  fileName: v.string(),
  fileSize: v.number(),
  mimeType: v.string(),
  position: v.number(),
})
  .index("by_message_id", ["messageId"])
  .index("by_file_id", ["fileId"]);
