// sso_domains: Maps email domains to SSO providers for login routing.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const ssoDomains = defineTable({
  oauthProviderId: v.id("oauth_providers"),
  domain: v.string(), // e.g., "acme.com". One domain maps to one provider.
  verified: v.boolean(), // Has the org proven domain ownership (via DNS TXT record or email)?
  verifiedAt: v.optional(v.number()),
})
  .index("by_domain", ["domain"])
  .index("by_oauth_provider_id", ["oauthProviderId"]);
