// tags: Labels for categorizing and filtering contacts.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const tags = defineTable({
  name: v.string(),
  description: v.optional(v.string()),
  createdBy: v.optional(v.id("users")),
  updatedAt: v.number(),
})
  .index("by_name", ["name"]);
