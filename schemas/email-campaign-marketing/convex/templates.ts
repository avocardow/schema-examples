// templates: Reusable email templates with HTML and text content.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const templates = defineTable({
  name: v.string(),
  subject: v.optional(v.string()),
  htmlBody: v.optional(v.string()),
  textBody: v.optional(v.string()),
  fromName: v.optional(v.string()),
  fromEmail: v.optional(v.string()),
  createdBy: v.optional(v.id("users")),
  updatedAt: v.number(),
})
  .index("by_created_by", ["createdBy"]);
