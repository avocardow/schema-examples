// file_tag_assignments: Many-to-many join between files and tags with audit trail.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const file_tag_assignments = defineTable({
  fileId: v.id("files"), // The tagged file. Cascade: deleting a file removes all its tag assignments.
  tagId: v.id("file_tags"), // The applied tag. Cascade: deleting a tag removes all its assignments.
  taggedBy: v.id("users"), // Who applied this tag to this file. Restrict: don't delete users who tagged files.
  // no createdAt — Convex provides _creationTime
})
  .index("by_tag_id", ["tagId"])
  .index("by_tagged_by", ["taggedBy"])
  .index("by_file_tag", ["fileId", "tagId"]);
