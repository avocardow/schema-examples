// organization_invitations: Pending invitations to join an organization.
// Separate from organization_members because an invitee may not have an account yet.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const organizationInvitations = defineTable({
  organizationId: v.id("organizations"),
  email: v.string(), // Invitee's email. They may or may not have an account yet.
  roleId: v.id("roles"), // The role they'll get upon acceptance.

  status: v.union(
    v.literal("pending"),
    v.literal("accepted"),
    v.literal("expired"),
    v.literal("revoked"),
  ),

  tokenHash: v.string(), // Hashed invitation token. Raw token sent in the invite email.
  inviterId: v.optional(v.id("users")), // Who sent the invitation. Null if system-generated.
  expiresAt: v.number(), // Typically 7 days.
  acceptedAt: v.optional(v.number()),
})
  .index("by_org_status", ["organizationId", "status"])
  .index("by_email", ["email"])
  .index("by_token_hash", ["tokenHash"]);
