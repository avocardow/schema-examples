// employee_documents: Documents attached to an employee record (contracts, tax forms, certifications, etc.).
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const employee_documents = defineTable({
  employeeId: v.id("employees"), // FK to employees. Cascade: deleting the employee removes all their documents.
  fileId: v.id("files"), // FK to files. Cascade: deleting the file removes the document record.
  type: v.union(
    v.literal("contract"),
    v.literal("tax_form"),
    v.literal("identification"),
    v.literal("certification"),
    v.literal("offer_letter"),
    v.literal("performance_review"),
    v.literal("other"),
  ),
  name: v.string(),
  description: v.optional(v.string()),
  issuedDate: v.optional(v.string()), // ISO 8601 date string.
  expiryDate: v.optional(v.string()), // ISO 8601 date string.
  status: v.union(
    v.literal("active"),
    v.literal("expired"),
    v.literal("superseded"),
    v.literal("archived"),
  ),
  uploadedBy: v.optional(v.id("users")), // FK to users. Set null on user deletion.
  updatedAt: v.number(),
  // no createdAt — Convex provides _creationTime
})
  .index("by_employee_id", ["employeeId"])
  .index("by_file_id", ["fileId"])
  .index("by_type", ["type"])
  .index("by_expiry_date", ["expiryDate"])
  .index("by_status", ["status"]);
