// file_comments: Threaded comments on files — supports nested replies via parent_id self-reference and resolved state for review workflows.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const file_comments = defineTable({
  fileId: v.id("files"), // The file being commented on. Cascade: deleting a file removes all its comments.
  parentId: v.optional(v.id("file_comments")), // Parent comment for threaded replies. Null = top-level comment. Cascade: deleting a parent removes all its replies.
  authorId: v.id("users"), // Who wrote this comment. Restrict: don't delete users who have comments.
  body: v.string(), // Comment text. Supports plain text or markdown depending on the application.
  isResolved: v.boolean(), // Whether this comment thread is resolved. Default false in app logic.
  updatedAt: v.number(),
  // no createdAt — Convex provides _creationTime
})
  .index("by_file_id_created", ["fileId"])
  .index("by_parent_id", ["parentId"])
  .index("by_author_id", ["authorId"]);
