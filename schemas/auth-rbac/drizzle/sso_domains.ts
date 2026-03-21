// sso_domains: Maps email domains to SSO providers for automatic login routing.
// When @acme.com users sign in, they're routed to Acme's SSO provider.
// Different from organization_domains (which proves domain ownership for auto-join).
// See README.md for full design rationale and field documentation.

import { pgTable, uuid, text, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { oauthProviders } from "./oauth_providers";

export const ssoDomains = pgTable(
  "sso_domains",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    oauthProviderId: uuid("oauth_provider_id").notNull().references(() => oauthProviders.id, { onDelete: "cascade" }),
    domain: text("domain").unique().notNull(), // e.g., "acme.com". One domain can only map to one provider.
    verified: boolean("verified").notNull().default(false), // Has the org proven they own this domain (via DNS TXT record or email)?
    verifiedAt: timestamp("verified_at", { withTimezone: true }), // When verification succeeded.
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    // unique(domain) is already created by the field constraint above.
    index("idx_sso_domains_oauth_provider_id").on(table.oauthProviderId), // "Which domains are claimed by this provider?"
  ]
);
