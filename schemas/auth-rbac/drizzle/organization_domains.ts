// organization_domains: Verified domains owned by an organization.
// Enables auto-join: users with @acme.com are automatically added to the Acme org on signup.
// Different from sso_domains (which routes login traffic to an SSO provider).
// See README.md for full design rationale and field documentation.

import { pgTable, uuid, text, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";

export const organizationDomains = pgTable(
  "organization_domains",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
    domain: text("domain").unique().notNull(), // e.g., "acme.com". Lowercase, no protocol prefix.
    verified: boolean("verified").notNull().default(false), // Only verified domains should trigger auto-join or SSO routing.
    verificationMethod: text("verification_method"), // "dns" (TXT record), "email" (verification email to admin@domain), etc.
    verificationToken: text("verification_token"), // The token/value the org needs to set in DNS or confirm via email.
    verifiedAt: timestamp("verified_at", { withTimezone: true }), // When verification succeeded.
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    // unique(domain) is already created by the field constraint above.
    index("idx_organization_domains_organization_id").on(table.organizationId), // "Which domains does this org own?"
  ]
);
