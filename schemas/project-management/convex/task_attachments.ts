// taskAttachments: files uploaded and linked to tasks.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const taskAttachments = defineTable({
  taskId: v.id("tasks"),
  uploadedBy: v.optional(v.id("users")),
  fileName: v.string(),
  fileUrl: v.string(),
  fileSize: v.optional(v.number()),
  mimeType: v.optional(v.string()),
})
  .index("by_task_id", ["taskId"])
  .index("by_uploaded_by", ["uploadedBy"]);
