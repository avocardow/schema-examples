// teams: Sub-groups within an organization (e.g., "Engineering", "Marketing").
// Lighter than nested organizations -- just for grouping members.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const teams = defineTable({
  organizationId: v.id("organizations"),
  name: v.string(), // Display name (e.g., "Engineering").
  slug: v.string(), // URL-safe identifier, unique within the org.
  updatedAt: v.number(),
})
  .index("by_organization_id", ["organizationId"])
  .index("by_org_slug", ["organizationId", "slug"]);
