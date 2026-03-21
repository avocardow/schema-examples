// organization_domains: Verified domains owned by an organization.
// Used for auto-join on signup and branding.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const organizationDomains = defineTable({
  organizationId: v.id("organizations"),
  domain: v.string(), // e.g., "acme.com". Lowercase, no protocol prefix.
  verified: v.boolean(), // Only verified domains should trigger auto-join.
  verificationMethod: v.optional(v.string()), // "dns" (TXT record), "email", etc.
  verificationToken: v.optional(v.string()), // The token/value the org needs to set in DNS or confirm via email.
  verifiedAt: v.optional(v.number()),
})
  .index("by_domain", ["domain"])
  .index("by_organization_id", ["organizationId"]);
