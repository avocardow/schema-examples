// screenshots: Visual context images for translators.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const screenshots = defineTable({
  name: v.string(),
  filePath: v.string(),
  fileSize: v.optional(v.number()),
  mimeType: v.optional(v.string()),
  width: v.optional(v.number()),
  height: v.optional(v.number()),
  uploadedBy: v.optional(v.id("users")),
  updatedAt: v.number(),
});
